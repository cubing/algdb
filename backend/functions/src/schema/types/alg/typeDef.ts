import { Algset, User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateBooleanField,
  generateIntegerField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  ...generateIdField(),
  sequence: generateStringField({ allowNull: false }),
  is_approved: generateBooleanField({ allowNull: false, defaultValue: false }),
  score: generateIntegerField({ allowNull: false, defaultValue: 0 }),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
};
