import {
  JomqlObjectTypeLookup,
  JomqlArgsError,
  RootResolverDefinition,
  JomqlInitializationError,
  JomqlRootResolverType,
  JomqlInputType,
  JomqlInputTypeLookup,
  JomqlObjectType,
  JomqlInputFieldType,
} from "jomql";
import { NormalService, PaginatedService, EnumService } from "../core/services";
import { generatePaginatorPivotResolverObject } from "../helpers/typeDef";
import { capitalizeString } from "../helpers/shared";
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

  methods.forEach((method) => {
    const capitalizedMethod = capitalizeString(method);
    let methodName;
    switch (method) {
      case "get":
        methodName = method + capitalizedClass;
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "get",
            route: "/" + service.typename + "/:id",
            query: service.presets.default,
          },
          type: service.typeDefLookup,
          allowNull: false,
          args: new JomqlInputFieldType({
            required: true,
            type: service.inputTypeDefLookup,
          }),
          resolver: ({ req, query, args, fieldPath }) => {
            return service.getRecord({
              req,
              query,
              args,
              fieldPath,
            });
          },
        });
        break;
      case "getMultiple":
        if (service instanceof PaginatedService) {
          methodName = "get" + capitalizeString(service.paginator.typename);
          rootResolvers[
            "get" + capitalizeString(service.paginator.typename)
          ] = new JomqlRootResolverType(<RootResolverDefinition>{
            name: methodName,
            restOptions: {
              method: "get",
              route: "/" + service.typename,
              query: service.paginator.presets.default,
            },
            ...generatePaginatorPivotResolverObject({
              pivotService: service,
            }),
          });
        } else {
          throw new JomqlInitializationError({
            message: `Cannot getMultiple of a non-paginated type '${service.typename}'`,
          });
        }
        break;
      case "delete":
        methodName = method + capitalizedClass;
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "delete",
            route: "/" + service.typename + "/:id",
            query: service.presets.default,
          },
          type: service.typeDefLookup,
          allowNull: false,
          args: new JomqlInputFieldType({
            required: true,
            type: service.inputTypeDefLookup,
          }),
          resolver: ({ req, query, args, fieldPath }) =>
            service.deleteRecord({
              req,
              query,
              args,
              fieldPath,
            }),
        });
        break;
      case "update":
        const updateArgs = {};
        methodName = method + capitalizedClass;
        Object.entries(service.getTypeDef().definition.fields).forEach(
          ([key, typeDefField]) => {
            let typeField = typeDefField.type;

            // if typeField is JomqlObjectTypeLookup, convert to JomqlInputTypeLookup
            if (typeField instanceof JomqlObjectTypeLookup) {
              typeField = new JomqlInputTypeLookup(
                "get" + capitalizeString(typeField.name)
              );
            } else if (typeField instanceof JomqlObjectType) {
              typeField = new JomqlInputTypeLookup(
                "get" + capitalizeString(typeField.definition.name)
              );
            }

            if (typeDefField.updateable) {
              // generate the argDefinition for the string type
              updateArgs[key] = new JomqlInputFieldType({
                type: typeField,
                required: false,
                allowNull: typeDefField.allowNull,
                arrayOptions: typeDefField.arrayOptions,
              });
            }
          }
        );
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "put",
            route: "/" + service.typename + "/:id",
            query: service.presets.default,
          },
          type: service.typeDefLookup,
          allowNull: false,
          args: new JomqlInputFieldType({
            required: true,
            type: new JomqlInputType({
              name: methodName,
              fields: {
                item: new JomqlInputFieldType({
                  type: service.inputTypeDefLookup,
                  required: true,
                }),
                fields: new JomqlInputFieldType({
                  type: new JomqlInputType({
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
                  }),
                  required: true,
                }),
              },
            }),
          }),
          resolver: ({ req, query, args, fieldPath }) =>
            service.updateRecord({ req, query, args, fieldPath }),
        });
        break;
      case "create":
        const createArgs = {};
        methodName = method + capitalizedClass;
        Object.entries(service.getTypeDef().definition.fields).forEach(
          ([key, typeDefField]) => {
            let typeField = typeDefField.type;

            // if typeField is JomqlObjectTypeLookup, convert to JomqlInputTypeLookup
            if (typeField instanceof JomqlObjectTypeLookup) {
              typeField = new JomqlInputTypeLookup(
                "get" + capitalizeString(typeField.name)
              );
            } else if (typeField instanceof JomqlObjectType) {
              typeField = new JomqlInputTypeLookup(
                "get" + capitalizeString(typeField.definition.name)
              );
            }

            if (typeDefField.addable) {
              // generate the argDefinition for the string type
              createArgs[key] = new JomqlInputFieldType({
                type: typeField,
                required: typeDefField.required,
                allowNull: typeDefField.allowNull,
                arrayOptions: typeDefField.arrayOptions,
              });
            }
          }
        );
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "post",
            route: "/" + service.typename,
            query: service.presets.default,
          },
          type: service.typeDefLookup,
          allowNull: false,
          args: new JomqlInputFieldType({
            required: true,
            type: new JomqlInputType({
              name: methodName,
              fields: createArgs,
            }),
          }),
          resolver: ({ req, query, args, fieldPath }) =>
            service.createRecord({
              req,
              query,
              args,
              fieldPath,
            }),
        });
        break;
      case "created":
        methodName = service.typename + capitalizedMethod;
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "post",
            route: "/subscribe/" + service.typename + capitalizedMethod,
            query: service.presets.default,
          },
          type: service.typeDefLookup,
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
        });
        break;
      case "deleted":
        methodName = service.typename + capitalizedMethod;
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "post",
            route: "/subscribe/" + service.typename + capitalizedMethod,
            query: service.presets.default,
          },
          type: service.typeDefLookup,
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
        });
        break;
      case "updated":
        methodName = service.typename + capitalizedMethod;
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "post",
            route: "/subscribe/" + service.typename + capitalizedMethod,
            query: service.presets.default,
          },
          type: service.typeDefLookup,
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
        });
        break;
      case "listUpdated":
        methodName = service.typename + capitalizedMethod;
        rootResolvers[methodName] = new JomqlRootResolverType({
          name: methodName,
          restOptions: {
            method: "post",
            route: "/subscribe/" + service.typename + capitalizedMethod,
            query: service.presets.default,
          },
          type: service.typeDefLookup,
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
        });
        break;
      default:
        throw new Error(`Unknown root resolver method requested: '${method}'`);
    }
  });

  return rootResolvers;
}

export function generateEnumRootResolver(enumService: EnumService) {
  const capitalizedClass = capitalizeString(enumService.paginator.typename);
  const methodName = "get" + capitalizedClass;
  const rootResolvers = {
    [methodName]: new JomqlRootResolverType({
      name: methodName,
      restOptions: {
        method: "get",
        route: "/" + enumService.paginator.typename,
        query: enumService.presets.default,
      },
      allowNull: false,
      type: enumService.paginator.typeDef,
      resolver: ({ req, args, query, fieldPath }) =>
        enumService.paginator.getRecord({
          req,
          args,
          query,
          fieldPath,
        }),
    }),
  };

  return rootResolvers;
}
