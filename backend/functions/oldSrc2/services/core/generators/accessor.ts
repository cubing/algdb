import { Service, AccessorService } from "../services";
import { generateAccessorInfoService } from "./accessorInfo";
import { badPermissionsError } from "../../../helpers/tier0/error";

export function generateAccessorService(service: Service) {
  return new AccessorService(service);
}

export function generateAccessorTypeDef(service: Service) {
  const AccessorInfo = generateAccessorInfoService(service);

  return {
    accessorInfo: {
      type: AccessorInfo.__typename,
      resolver: async (req, args, query, typename, currentObject) => {
        return AccessorInfo.getRecord(req, args, query);
      },
    },
    data: {
      type: [service.__typename],
      resolver: async (req, args, query, typename, currentObject) => {
        try {
          //if it does not pass the access control, throw an error
          if (!(await service.testPermissions("get", req))) {
            throw badPermissionsError();
          }

          const results = await service.getRecord(req, args, query);
          return results;
        } catch (err) {
          return null;
        }
      },
    },
  };
}
