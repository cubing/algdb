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

import { BaseScalars } from "jomql";

// base scalars
export const string = BaseScalars.string;
export const number = BaseScalars.number;
export const boolean = BaseScalars.boolean;
export const unknown = BaseScalars.unknown;

// added scalars
export { imageUrl } from "./imageUrl";
export { unixTimestamp } from "./unixTimestamp";
export { jsonAsString } from "./jsonAsString";
export { id } from "./id";

// generated scalars
export const userRole = generateKenumScalarDefinition(
  "userRole",
  userRoleKenum
);

export const filterOperator = generateEnumScalarDefinition(
  "filterOperator",
  filterOperatorEnum
);

export const caseVisualization = generateEnumScalarDefinition(
  "caseVisualization",
  caseVisualizationEnum
);

export const userPermission = generateEnumScalarDefinition(
  "userPermission",
  userPermissionEnum
);
