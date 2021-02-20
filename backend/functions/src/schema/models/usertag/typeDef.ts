import { Usertag, User } from "../../services";
import { JomqlObjectType, ObjectTypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateTypenameField,
} from "../../helpers/typeDef";

export default new JomqlObjectType(<ObjectTypeDefinition>{
  name: Usertag.typename,
  description: "Usertag type",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(Usertag),
    name: generateStringField({
      allowNull: false,
      sqlDefinition: { unique: true },
    }),
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  },
});
