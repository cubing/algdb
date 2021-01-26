import { Puzzle, User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateBooleanField,
  generateTypenameField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  name: Puzzle.typename,
  description: "Puzzle Type",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(Puzzle),
    name: generateStringField({ allowNull: false }),
    code: generateStringField({
      allowNull: false,
      sqlDefinition: {
        unique: true,
      },
    }),
    is_public: generateBooleanField({ allowNull: false, defaultValue: true }),
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  },
};
