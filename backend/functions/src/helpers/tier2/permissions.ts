import mysqlHelper from '../tier1/mysql';

export function generateCreatedByUser(service: any) {
  return async function(req, args, query) {
    //check if logged in
    if(!req.user) return false;

    try {
      const record = await service.getRecord(req, {
        id: args.id
      }, { created_by: null }, true);

      return record?.created_by === req.user.id;
    } catch(err) {
      return false;
    }
  }
}

export function generateCheckPermissionsLink(method: string, service: any) {
  return async function(req, args, query) {
    //check if logged in
    if(!req.user) return false;
    if(!service.permissionsLink) return false;
    try {
      //check the permissionsLink entry
      const records = await mysqlHelper.executeDBQuery("SELECT permissions, admin FROM " + service.permissionsLink.__typename + " WHERE user = :user AND " + service.__typename + " = :" + service.__typename, {
        user: req.user.id,
        [service.__typename]: args.id
      });

      if(records.length < 1) return false;

      //if admin==1, allow
      if(records[0].admin > 0) return true;

      //decode
      const permissions = JSON.parse(records[0].permissions);

      if(!permissions) return false;

      return permissions[method] > 0;
    } catch(err) {
      return false;
    }
  }
}