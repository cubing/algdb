import { InputTypeDefinition, JomqlArgsError, RootResolverObject } from "jomql";
import { NormalService, PaginatedService, EnumService } from "../core/services";
import { generatePaginatorPivotResolverObject } from "../helpers/typeDef";
import { isObject, capitalizeString } from "../helpers/shared";
import { inputDefs } from "../inputDefs";
import { JomqlInitializationError } from "jomql/lib/classes";

type BaseRootResolverTypes =
  | "get"
  | "getMultiple"
  | "delete"
  | "create"
  | "update"
  | "created"
  | "deleted"
  | "updated"
  | "listUpdated";

export function generateBaseRootResolvers(
  service: NormalService,
  methods: BaseRootResolverTypes[]
) {
  const capitalizedClass = capitalizeString(service.typename);

  const rootResolvers = {};

  // build unique key map and ArgDefinition here
  const uniqueKeyMap = {};
  Object.entries(service.uniqueKeyMap).forEach(([uniqueKeyName, entry]) => {
    entry.forEach((key) => {
      uniqueKeyMap[key] = { type: service.typeDef.fields[key].type };
    });
  });
  const lookupRecordInputDefinition: InputTypeDefinition = {
    fields: uniqueKeyMap,
    inputsValidator: (args, fieldPath) => {
      // check if a valid combination of key args exist
      let validKeyCombination = false;
      if (isObject(args)) {
        const argsArray = Object.keys(args);
        for (const keyName in service.uniqueKeyMap) {
          if (
            service.uniqueKeyMap[keyName].every((ele) =>
              argsArray.includes(ele)
            ) &&
            argsArray.every((ele) =>
              service.uniqueKeyMap[keyName].includes(ele)
            )
          ) {
            validKeyCombination = true;
            break;
          }
        }
      }

      if (!validKeyCombination) {
        throw new JomqlArgsError({
          message: `Invalid combination of args`,
          fieldPath,
        });
      }
    },
  };

  // register the record lookup definition under getX
  inputDefs.set("get" + capitalizedClass, lookupRecordInputDefinition);

  methods.forEach((method) => {
    const capitalizedMethod = capitalizeString(method);
    switch (method) {
      case "get":
        rootResolvers[method + capitalizedClass] = <RootResolverObject>{
          method: "get" as const,
          route: "/" + service.typename + "/:id",
          type: service.typename,
          isArray: false,
          allowNull: false,
          query: service.presets.default,
          args: {
            required: true,
            type: lookupRecordInputDefinition,
          },
          resolver: ({ req, query, args, fieldPath }) => {
            return service.getRecord({
              req,
              query,
              args,
              fieldPath,
            });
          },
        };
        break;
      case "getMultiple":
        if (service instanceof PaginatedService) {
          rootResolvers[
            "get" + capitalizeString(service.paginator.typename)
          ] = <RootResolverObject>{
            method: "get" as const,
            route: "/" + service.typename,
            ...generatePaginatorPivotResolverObject({
              pivotService: service,
            }),
          };
        } else {
          throw new JomqlInitializationError({
            message: `Cannot getMultiple of a non-paginated type '${service.typename}'`,
          });
        }
        break;
      case "delete":
        rootResolvers[method + capitalizedClass] = <RootResolverObject>{
          method: "delete" as const,
          route: "/" + service.typename + "/:id",
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            required: true,
            type: lookupRecordInputDefinition,
          },
          resolver: ({ req, query, args, fieldPath }) =>
            service.deleteRecord({
              req,
              query,
              args,
              fieldPath,
            }),
        };
        break;
      case "update":
        const updateArgs = {};
        Object.entries(service.typeDef.fields).forEach(
          ([key, typeDefField]) => {
            const type = typeDefField.type;
            if (typeDefField.updateable) {
              // generate the argDefinition for the string type
              updateArgs[key] = {
                type:
                  typeof type === "string"
                    ? "get" + capitalizeString(type)
                    : type,
                required: false,
                isArray: typeDefField.isArray,
              };
            }
          }
        );
        rootResolvers[method + capitalizedClass] = <RootResolverObject>{
          method: "put" as const,
          route: "/" + service.typename + "/:id",
          query: service.presets.default,
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            required: true,
            type: {
              fields: {
                item: {
                  type: "get" + capitalizedClass,
                  required: true,
                },
                fields: {
                  type: {
                    name: "update" + capitalizedClass + "Fields",
                    fields: updateArgs,
                    inputsValidator: (args, fieldPath) => {
                      // check if at least 1 valid update field provided
                      const { id, ...updateFields } = args;
                      if (Object.keys(updateFields).length < 1)
                        throw new JomqlArgsError({
                          message: `No valid fields to update`,
                          fieldPath,
                        });
                    },
                  },
                  required: true,
                },
              },
            },
          },
          resolver: ({ req, query, args, fieldPath }) =>
            service.updateRecord({ req, query, args, fieldPath }),
        };
        break;
      case "create":
        const createArgs = {};
        Object.entries(service.typeDef.fields).forEach(
          ([key, typeDefField]) => {
            const type = typeDefField.type;
            if (typeDefField.addable) {
              // generate the argDefinition for the string type
              createArgs[key] = {
                type:
                  typeof type === "string"
                    ? "get" + capitalizeString(type)
                    : type,
                required: typeDefField.required,
                isArray: typeDefField.isArray,
              };
            }
          }
        );
        rootResolvers[method + capitalizedClass] = <RootResolverObject>{
          method: "post" as const,
          route: "/" + service.typename,
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            required: true,
            type: {
              fields: createArgs,
            },
          },
          resolver: ({ req, query, args, fieldPath }) =>
            service.createRecord({
              req,
              query,
              args,
              fieldPath,
            }),
        };
        break;
      case "created":
        rootResolvers[service.typename + capitalizedMethod] = <
          RootResolverObject
        >{
          method: "post" as const,
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: ({ req, query, args, fieldPath }) =>
            service.subscribeToMultipleItem(
              service.typename + capitalizedMethod,
              {
                req,
                query,
                args,
                fieldPath,
              }
            ),
        };
        break;
      case "deleted":
        rootResolvers[service.typename + capitalizedMethod] = <
          RootResolverObject
        >{
          method: "post" as const,
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: ({ req, query, args, fieldPath }) =>
            service.subscribeToSingleItem(
              service.typename + capitalizedMethod,
              {
                req,
                query,
                args,
                fieldPath,
              }
            ),
        };
        break;
      case "updated":
        rootResolvers[service.typename + capitalizedMethod] = <
          RootResolverObject
        >{
          method: "post" as const,
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: ({ req, query, args, fieldPath }) =>
            service.subscribeToSingleItem(
              service.typename + capitalizedMethod,
              {
                req,
                query,
                args,
                fieldPath,
              }
            ),
        };
        break;
      case "listUpdated":
        rootResolvers[service.typename + capitalizedMethod] = <
          RootResolverObject
        >{
          method: "post" as const,
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: ({ req, query, args, fieldPath }) =>
            service.subscribeToMultipleItem(
              service.typename + capitalizedMethod,
              {
                req,
                query,
                args,
                fieldPath,
              }
            ),
        };
        break;
      default:
        throw new Error(`Unknown root resolver method requested: '${method}'`);
    }
  });

  return rootResolvers;
}

export function generateEnumRootResolver(enumService: EnumService) {
  const capitalizedClass = capitalizeString(enumService.paginator.typename);

  const rootResolvers = {
    ["get" + capitalizedClass]: {
      method: "get" as const,
      route: "/" + enumService.paginator.typename,
      isArray: false,
      allowNull: false,
      type: enumService.paginator.typename,
      resolver: ({ req, args, query, fieldPath }) =>
        enumService.paginator.getRecord({
          req,
          args,
          query,
          fieldPath,
        }),
    },
  };

  return rootResolvers;
}
