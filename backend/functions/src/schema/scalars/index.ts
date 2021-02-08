import {
  generateKenumScalarDefinition,
  generateEnumScalarDefinition,
} from "../helpers/scalar";
import {
  filterOperatorEnum,
  caseVisualizationEnum,
  userRoleKenum,
  userPermissionEnum,
} from "../enums";

import { BaseScalars, JomqlScalarType } from "jomql";

// base scalars
export const string = BaseScalars.string;
// export const number = BaseScalars.number;
export const boolean = BaseScalars.boolean;
export const unknown = BaseScalars.unknown;

// added scalars
export { number } from "./number"; // replacing the built-in number type to automatically parse Number-like strings
export { imageUrl } from "./imageUrl";
export { unixTimestamp } from "./unixTimestamp";
export { jsonAsString } from "./jsonAsString";
export { id } from "./id";

// generated scalars
export const userRole = new JomqlScalarType(
  generateKenumScalarDefinition("userRole", userRoleKenum)
);

export const filterOperator = new JomqlScalarType(
  generateEnumScalarDefinition("filterOperator", filterOperatorEnum)
);

export const caseVisualization = new JomqlScalarType(
  generateEnumScalarDefinition("caseVisualization", caseVisualizationEnum)
);

export const userPermission = new JomqlScalarType(
  generateEnumScalarDefinition("userPermission", userPermissionEnum)
);
