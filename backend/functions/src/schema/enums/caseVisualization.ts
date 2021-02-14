import { Enum } from "../helpers/enum";

export class caseVisualizationEnum extends Enum {
  static readonly V_2D = new caseVisualizationEnum("V_2D");
  static readonly V_3D = new caseVisualizationEnum("V_3D");
  static readonly V_PG3D = new caseVisualizationEnum("V_PG3D");
}
