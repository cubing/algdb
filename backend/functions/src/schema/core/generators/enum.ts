import { EnumService } from "../services";
import * as Scalars from "../../scalars";
import { generateBlankRootResolver } from "../../helpers/rootResolver";

export function generateEnumRootResolver(enumService: EnumService) {
  const rootResolvers = generateBlankRootResolver();

  const capitalizedClass =
    enumService.typename.charAt(0).toUpperCase() +
    enumService.typename.slice(1);

  // check for valid matching scalar
  if (!Scalars[enumService.typename])
    throw new Error("Enum scalar not defined");

  // add getAll method
  rootResolvers.query["getAll" + capitalizedClass] = {
    method: "get",
    route: "/" + enumService.typename,
    isArray: true,
    allowNull: false,
    type: Scalars[enumService.typename],
    resolver: (req, args, query) => enumService.getAllRecords(req, args, query),
  };

  return rootResolvers;
}
