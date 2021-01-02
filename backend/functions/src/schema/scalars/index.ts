import {
  generateKenumScalarDefinition,
  generateEnumScalarDefinition,
} from "../core/generators/scalarDefinition";
import { userRoleKenum } from "../kenums";
import { filterOperatorEnum, caseVisualizationEnum } from "../enums";

export { imageUrl } from "./imageUrl";
export { unixTimestamp } from "./unixTimestamp";
export { jsonAsString } from "./jsonAsString";
export { id } from "./id";
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
