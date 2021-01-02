import { User, Puzzle, Algset, CaseVisualization } from "../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateBooleanField,
  generateJoinableField,
  generateEnumField,
} from "../../helpers/tier0/typeDef";
import { dataTypes, sequelizeDataTypes } from "jomql";

export default {
  ...generateIdField(),
  name: {
    type: dataTypes.STRING,
    allowNull: false,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  code: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
      unique: "codePuzzleIndex",
    },
    addable: true,
    updateable: true,
  },
  mask: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  ...generateEnumField(
    "visualization",
    CaseVisualization,
    {},
    { defaultValue: CaseVisualization.enum[CaseVisualization.enum.V_2D] }
  ),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
  ...generateBooleanField("is_public"),
  ...generateJoinableField({
    name: "parent",
    service: Algset,
    mysqlOptions: { unique: "codePuzzleIndex" },
    required: false,
  }),
  ...generateJoinableField({
    service: Puzzle,
    mysqlOptions: { unique: "codePuzzleIndex" },
  }),
  score: {
    type: dataTypes.INTEGER,
    mysqlOptions: {
      type: sequelizeDataTypes.INTEGER,
    },
    addable: true,
  },
};
