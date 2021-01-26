import { Tag, User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateTypenameField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  name: Tag.typename,
  description: "Tag type",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(Tag),
    name: generateStringField({
      allowNull: false,
      sqlDefinition: { unique: true },
    }),
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  },
};
