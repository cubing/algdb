import {
  generateKenumScalarDefinition,
  generateEnumScalarDefinition,
} from "../core/generators/scalarDefinition";
import { userRoleKenum } from "../kenums";
import {
  productStatusEnum,
  filterOperatorEnum,
  caseVisualizationEnum,
} from "../enums";

export { imageUrl } from "./imageUrl";
export { unixTimestamp } from "./unixTimestamp";
export { jsonAsString } from "./jsonAsString";
export { id } from "./id";
export const userRole = generateKenumScalarDefinition(
  "userRole",
  userRoleKenum
);
export const productStatus = generateEnumScalarDefinition(
  "productStatus",
  productStatusEnum
);

export const filterOperator = generateEnumScalarDefinition(
  "filterOperator",
  filterOperatorEnum
);

export const caseVisualization = generateEnumScalarDefinition(
  "caseVisualization",
  caseVisualizationEnum
);
