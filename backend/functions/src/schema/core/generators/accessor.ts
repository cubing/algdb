import { NormalService, AccessorInfoService } from "../services";
import { badPermissionsError } from "../../helpers/error";

export function generateAccessorTypeDef(service: NormalService) {
  const AccessorInfo = new AccessorInfoService(service);

  return {
    description: "Accessor Type",
    fields: {
      accessorInfo: {
        type: AccessorInfo.typename,
        isArray: false,
        allowNull: false,
        resolver: async (req, args, query, typename, currentObject) => {
          return AccessorInfo.getRecord(req, args, query);
        },
      },
      data: {
        type: service.typename,
        isArray: false,
        allowNull: false,
        resolver: async (req, args, query, typename, currentObject) => {
          try {
            //if it does not pass the access control, throw an error
            if (!(await service.testPermissions("get", req, args, query))) {
              throw badPermissionsError();
            }

            const results = await service.getRecord(req, args, query);
            return results;
          } catch (err) {
            return null;
          }
        },
      },
    },
  };
}
