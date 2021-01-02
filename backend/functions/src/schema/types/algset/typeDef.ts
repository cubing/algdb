import { Puzzle, Algset, User } from "../../services";
import * as Scalars from "../../scalars";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateBooleanField,
  generateJoinableField,
  generateIntegerField,
  generateEnumField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  ...generateIdField(),
  name: generateStringField({ allowNull: false }),
  code: generateStringField({
    allowNull: false,
    sqlDefinition: { unique: "codePuzzleIndex" },
  }),
  parent: generateJoinableField({
    allowNull: true,
    service: Algset,
    sqlDefinition: { unique: "codePuzzleIndex" },
  }),
  puzzle: generateJoinableField({
    allowNull: false,
    service: Puzzle,
    sqlDefinition: { unique: "codePuzzleIndex" },
  }),
  mask: generateStringField({ allowNull: true }),
  visualization: generateEnumField({
    allowNull: false,
    scalarDefinition: Scalars.caseVisualization,
    defaultValue: "V_2D",
  }),
  score: generateIntegerField({ allowNull: false, defaultValue: 0 }),
  is_public: generateBooleanField({ allowNull: false, defaultValue: true }),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
};
