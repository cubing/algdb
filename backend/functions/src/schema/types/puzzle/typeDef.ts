import { User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateBooleanField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  ...generateIdField(),
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
};
