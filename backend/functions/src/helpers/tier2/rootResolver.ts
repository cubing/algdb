import { dataTypes } from 'jomql';
import { generatePaginatorArgs } from '../tier0/typeDef';

export function generateRootResolvers(rootResolvers: any, service: any, typeDefs: any, params: any) {
  const capitalizedClass = service.__typename.charAt(0).toUpperCase() + service.__typename.slice(1);

  params.methods.forEach((method) => {
    const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);
    switch(method) {
      case "get":
        rootResolvers.query[method + capitalizedClass] = {
          method: "get",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          args: generatePaginatorArgs(service),
          resolver: (req) => service.getRecord(req, {
            ...req.query,
            ...req.params.id !== ":id" && { id: req.params.id },
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "getMultiple":
        rootResolvers.query[method + capitalizedClass] = {
          method: "get",
          route: "/" + service.__typename,
          type: service.paginator.__typename,
          args: generatePaginatorArgs(service),
          resolver: (req) => service.paginator.getRecord(req, {
            ...req.query,
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "delete":
        rootResolvers.mutation[method + capitalizedClass] = {
          method: "delete",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          args: {
            id: { type: dataTypes.ID, required: true }
          },
          resolver: (req) => service.deleteRecord(req, {
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "update":
        const updateArgs = {};
        for(const field in typeDefs[service.__typename]) {
          if(typeDefs[service.__typename][field].updateable) {
            updateArgs[field] = { type: typeDefs[service.__typename][field].type }
          }
        }
        rootResolvers.mutation[method + capitalizedClass] = {
          method: "put",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          args: {
            id: { type: dataTypes.ID, required: true },
            ...updateArgs
          },
          resolver: (req) => service.updateRecord(req, {
            ...req.body,
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "create":
        const createArgs = {};
        for(const field in typeDefs[service.__typename]) {
          if(typeDefs[service.__typename][field].addable) {
            createArgs[field] = { type: typeDefs[service.__typename][field].type }
          }
        }
        rootResolvers.mutation[method + capitalizedClass] = {
          method: "post",
          route: "/" + service.__typename,
          type: service.__typename,
          args: createArgs,
          resolver: (req) => service.createRecord(req, {
            ...req.body,
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "created":
        rootResolvers.subscription[service.__typename + capitalizedMethod] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req) => service.subscribeToMultipleItem(service.__typename + capitalizedMethod, req, {
            ...req.params,
            ...req.jql?.__args,
          }, req.jql)
        }
        break;
      case "deleted":
        rootResolvers.subscription[service.__typename + capitalizedMethod] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req) => service.subscribeToSingleItem(service.__typename + capitalizedMethod, req, {
            ...req.params,
            ...req.jql?.__args,
          }, req.jql)
        }
        break;
      case "updated":
        rootResolvers.subscription[service.__typename + capitalizedMethod] = {
          method: "post",
          route: "/subscribe/" + service.__typename + capitalizedMethod,
          type: service.__typename,
          resolver: (req) => service.subscribeToSingleItem(service.__typename + capitalizedMethod, req, {
            ...req.params,
            ...req.jql?.__args,
          }, req.jql)
        }
        break;
    }
  });
};