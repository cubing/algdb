export function generateRootResolvers(rootResolvers: any, service: any, params: any) {
  const capitalizedClass = service.__typename.charAt(0).toUpperCase() + service.__typename.slice(1);

  params.methods.forEach((method) => {
    const capitalizedMethod = method.charAt(0).toUpperCase() + method.slice(1);
    switch(method) {
      case "get":
        rootResolvers.query[method + capitalizedClass] = {
          method: "get",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          resolver: (req) => service.getRecord(req, {
            ...req.query,
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "getMultiple":
        rootResolvers.query[method + capitalizedClass] = {
          method: "get",
          route: "/" + service.__typename,
          type: service.paginator.__typename,
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
          resolver: (req) => service.deleteRecord(req, {
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "update":
        rootResolvers.mutation[method + capitalizedClass] = {
          method: "put",
          route: "/" + service.__typename + "/:id",
          type: service.__typename,
          resolver: (req) => service.updateRecord(req, {
            ...req.body,
            ...req.params,
            ...req.jql?.__args
          }, req.jql)
        }
        break;
      case "create":
        rootResolvers.mutation[method + capitalizedClass] = {
          method: "post",
          route: "/" + service.__typename,
          type: service.__typename,
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