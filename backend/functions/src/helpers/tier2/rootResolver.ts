import { dataTypes, RootResolver } from "jomql";
import { generatePaginatorArgs } from "../tier0/typeDef";
import { Service } from "../../services/core/services/base";
import { PaginatedService } from "../../services/core/services/paginated";

export function generateBlankRootResolver(): RootResolver {
  return {
    query: {},
    mutation: {},
    subscription: {},
  };
}

export function generateRootResolvers(
  service: Service,
  //typeDefs: any,
  params: any,
  rootResolvers?: RootResolver
) {
  const capitalizedClass =
    service.__typename.charAt(0).toUpperCase() + service.__typename.slice(1);

  const updatedRootResolvers = rootResolvers ?? generateBlankRootResolver();

  params.methods.forEach((method) => {
    const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);
    switch (method) {
      case "get":
        updatedRootResolvers.query[method + capitalizedClass] = {
          method: "get",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          args: generatePaginatorArgs(service),
          resolver: (req, query, args) => service.getRecord(req, query, args),
        };
        break;
      case "getMultiple":
        if (service instanceof PaginatedService) {
          updatedRootResolvers.query[method + capitalizedClass] = {
            method: "get",
            route: "/" + service.__typename,
            type: service.paginator.__typename,
            args: generatePaginatorArgs(service),
            resolver: (req, query, args) =>
              service.paginator.getRecord(req, query, args),
          };
        }
        break;
      case "delete":
        updatedRootResolvers.mutation[method + capitalizedClass] = {
          method: "delete",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          args: {
            id: { type: dataTypes.ID, required: true },
          },
          resolver: (req, query, args) =>
            service.deleteRecord(req, query, args),
        };
        break;
      case "update":
        const updateArgs = {};
        /*
        for (const field in typeDefs[service.__typename]) {
          if (typeDefs[service.__typename][field].updateable) {
            updateArgs[field] = {
              type: typeDefs[service.__typename][field].type,
            };
          }
        }
        */
        updatedRootResolvers.mutation[method + capitalizedClass] = {
          method: "put",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          args: {
            id: { type: dataTypes.ID, required: true },
            ...updateArgs,
          },
          resolver: (req, query, args) =>
            service.updateRecord(req, query, args),
        };
        break;
      case "create":
        const createArgs = {};
        /*
        for (const field in typeDefs[service.__typename]) {
          if (typeDefs[service.__typename][field].addable) {
            createArgs[field] = {
              type: typeDefs[service.__typename][field].type,
            };
          }
        }
        */
        updatedRootResolvers.mutation[method + capitalizedClass] = {
          method: "post",
          route: "/" + service.__typename,
          type: service.__typename,
          args: createArgs,
          resolver: (req, query, args) =>
            service.createRecord(req, query, args),
        };
        break;
      case "created":
        updatedRootResolvers.subscription[
          service.__typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req, query, args) =>
            service.subscribeToMultipleItem(
              service.__typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      case "deleted":
        updatedRootResolvers.subscription[
          service.__typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req, query, args) =>
            service.subscribeToSingleItem(
              service.__typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      case "updated":
        updatedRootResolvers.subscription[
          service.__typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req, query, args) =>
            service.subscribeToSingleItem(
              service.__typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
      case "listUpdated":
        updatedRootResolvers.subscription[
          service.__typename + capitalizedMethod
        ] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req, query, args) =>
            service.subscribeToMultipleItem(
              service.__typename + capitalizedMethod,
              req,
              query,
              args
            ),
        };
        break;
    }
  });

  return updatedRootResolvers;
}
