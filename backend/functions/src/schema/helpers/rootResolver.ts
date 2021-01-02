import { RootResolver, RootResolverObject } from "jomql";
import { NormalService, PaginatedService } from "../core/services";
import { generatePaginatorPivotResolverObject } from "../helpers/typeDef";
import { isObject, capitalizeString } from "../helpers/shared";
import * as Scalars from "../scalars";

export function generateBlankRootResolver(): RootResolver {
  return {
    query: {},
    mutation: {},
    subscription: {},
  };
}

export function generateRootResolvers(
  service: NormalService,
  params: { methods: string[] },
  rootResolvers?: RootResolver
) {
  const capitalizedClass = capitalizeString(service.typename);

  const updatedRootResolvers = rootResolvers ?? generateBlankRootResolver();

  params.methods.forEach((method) => {
    const capitalizedMethod = capitalizeString(method);
    switch (method) {
      case "get":
        const uniqueKeyMap = {};
        for (const keyName in service.uniqueKeyMap) {
          service.uniqueKeyMap[keyName].forEach((key) => {
            uniqueKeyMap[key] = { type: service.typeDef[key].type };
          });
        }
        updatedRootResolvers.query[method + capitalizedClass] = {
          method: "get",
          route: "/" + service.typename + "/:id",
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            type: {
              fields: uniqueKeyMap,
            },
            argsValidator: (args, fieldPath) => {
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
                const fieldString = ["root"].concat(...fieldPath).join(".");
                throw new Error(
                  `Invalid combination of args on field '${fieldString}'`
                );
              }
            },
          },

          resolver: (req, query, args) => service.getRecord(req, query, args),
        };
        break;
      case "getMultiple":
        if (service instanceof PaginatedService) {
          updatedRootResolvers.query[
            "get" + capitalizeString(service.paginator.typename)
          ] = <RootResolverObject>{
            method: "get",
            route: "/" + service.typename,
            ...generatePaginatorPivotResolverObject({
              pivotService: service,
            }),
          };
        } else {
          throw new Error(
            `Cannot getMultiple of a non-paginated type '${service.typename}'`
          );
        }
        break;
      case "delete":
        updatedRootResolvers.mutation[method + capitalizedClass] = {
          method: "delete",
          route: "/" + service.typename + "/:id",
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            type: {
              fields: { id: { type: Scalars.id, required: true } },
            },
          },
          resolver: (req, query, args) =>
            service.deleteRecord(req, query, args),
        };
        break;
      case "update":
        const updateArgs = {};
        for (const field in service.typeDef) {
          if (service.typeDef[field].customOptions?.updateable) {
            updateArgs[field] = {
              type: service.typeDef[field].type,
              required: false,
              isArray: service.typeDef[field].isArray,
            };
          }
        }
        updatedRootResolvers.mutation[method + capitalizedClass] = {
          method: "put",
          route: "/" + service.typename + "/:id",
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            type: {
              fields: {
                id: { type: Scalars.id, required: true },
                ...updateArgs,
              },
            },
            argsValidator: (args, fieldPath) => {
              // check if at least 1 valid update field provided
              const { id, ...updateFields } = args;
              if (Object.keys(updateFields).length < 1)
                throw new Error(`No valid fields to update at '${fieldPath}'`);
            },
          },
          resolver: (req, query, args) =>
            service.updateRecord(req, query, args),
        };
        break;
      case "create":
        const createArgs = {};
        for (const field in service.typeDef) {
          if (service.typeDef[field].customOptions?.addable) {
            createArgs[field] = {
              type: service.typeDef[field].type,
            };
          }
        }
        updatedRootResolvers.mutation[method + capitalizedClass] = {
          method: "post",
          route: "/" + service.typename,
          type: service.typename,
          isArray: false,
          allowNull: false,
          args: {
            type: {
              fields: createArgs,
            },
          },
          resolver: (req, query, args) =>
            service.createRecord(req, query, args),
        };
        break;
      case "created":
        updatedRootResolvers.subscription[
          service.typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: (req, query, args) =>
            service.subscribeToMultipleItem(
              service.typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      case "deleted":
        updatedRootResolvers.subscription[
          service.typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: (req, query, args) =>
            service.subscribeToSingleItem(
              service.typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      case "updated":
        updatedRootResolvers.subscription[
          service.typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: (req, query, args) =>
            service.subscribeToSingleItem(
              service.typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      case "listUpdated":
        updatedRootResolvers.subscription[
          service.typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.typename + capitalizedMethod,
          type: service.typename,
          isArray: false,
          allowNull: false,
          resolver: (req, query, args) =>
            service.subscribeToMultipleItem(
              service.typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      default:
        throw new Error(`Unknown root resolver method requested: '${method}'`);
    }
  });

  return updatedRootResolvers;
}
