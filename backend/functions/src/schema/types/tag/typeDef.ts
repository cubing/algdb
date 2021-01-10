import { User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  ...generateIdField(),
  name: generateStringField({
    allowNull: false,
    sqlDefinition: { unique: true },
  }),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
};
