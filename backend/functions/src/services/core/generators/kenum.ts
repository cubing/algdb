import { KenumService } from "../services";
import { dataTypes } from "jomql";
import { itemNotFoundError } from "../../../helpers/tier0/error";
import { generateBlankRootResolver } from "../../../helpers/tier2/rootResolver";

export function generateKenumService(kenumName: string, currentEnum: object) {
  return new KenumService(kenumName, currentEnum);
}

export function generateKenumTypeDef(currentEnum: object) {
  return {
    id: {
      type: dataTypes.ID,
      resolver: async (req, args, query, typename, currentObject) => {
        // if args.name provided and is not numeric, attempt lookup
        // error handling for invalid values is in the name resolver
        if (args.name && Number.isNaN(parseInt(args.name)))
          return currentEnum[args.name];
        else return args.id;
      },
    },
    name: {
      type: dataTypes.STRING,
      resolver: async (req, args, query, typename, currentObject) => {
        let returnValue;
        if (args.name && Number.isNaN(parseInt(args.name)))
          returnValue = currentEnum[currentEnum[args.name]];
        else if (!Number.isNaN(parseInt(args.id)))
          returnValue = currentEnum[args.id];

        if (returnValue === undefined) throw itemNotFoundError();
        return returnValue;
      },
    },
  };
}

export function generateKenumRootResolver(enumService: KenumService) {
  const rootResolvers = generateBlankRootResolver();

  const capitalizedClass =
    enumService.__typename.charAt(0).toUpperCase() +
    enumService.__typename.slice(1);

  // add getOne method
  rootResolvers.query["get" + capitalizedClass] = {
    method: "get",
    route: "/" + enumService.__typename + "/:id",
    type: enumService.__typename,
    resolver: (req, args, query) => enumService.getRecord(req, args, query),
  };

  // add getAll method
  rootResolvers.query["getAll" + capitalizedClass] = {
    method: "get",
    route: "/" + enumService.__typename,
    type: [enumService.__typename],
    resolver: (req, args, query) => enumService.getAllRecords(req, args, query),
  };

  return rootResolvers;
}
