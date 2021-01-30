import { Alg, User } from "../../services";
import { JomqlObjectType, ObjectTypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateBooleanField,
  generateIntegerField,
  generateTypenameField,
} from "../../helpers/typeDef";

export default new JomqlObjectType(<ObjectTypeDefinition>{
  name: Alg.typename,
  description: "Algorithm",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(Alg),
    sequence: generateStringField({
      allowNull: false,
      sqlDefinition: { unique: true },
    }),
    is_approved: generateBooleanField({
      allowNull: false,
      defaultValue: false,
    }),
    score: generateIntegerField({ allowNull: false, defaultValue: 0 }),
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  },
});
