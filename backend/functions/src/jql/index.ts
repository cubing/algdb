import routerHelper from "./helpers/router";

export function process(app: any, schema) {
  app.use(function(req: any, res, next) {
    //handle jql queries
    if(req.method === "POST" && req.url === "/jql") {
      if(req.body.action in schema.allRootResolvers) {
        //map from action to method + url
        req.method = schema.allRootResolvers[req.body.action].method;
        req.url = schema.allRootResolvers[req.body.action].route;

        //add the app route that we are going to use
        app[schema.allRootResolvers[req.body.action].method](schema.allRootResolvers[req.body.action].route, routerHelper.externalFnWrapper(schema.allRootResolvers[req.body.action].resolver)); 
      }

      req.jql = req.body.query || {};
    } else {
      //if not using jql, must populate all the routes
      for(const prop in schema.allRootResolvers) {
        app[schema.allRootResolvers[prop].method](schema.allRootResolvers[prop].route, routerHelper.externalFnWrapper(schema.allRootResolvers[prop].resolver));
      }
    }
    next();
  });
  
  app.set('json replacer', function (key, value) {
    // undefined values are set to `null`
    if (typeof value === "undefined") {
      return null;
    }
    return value;
  });
  
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
  });
  
  app.options('*', function(req, res, next){
    res.header('Access-Control-Max-Age', "86400");
    res.sendStatus(200);
  });

  app.get("/schema", function(req, res) {
    res.send(schema.generateSchema());
  })
};