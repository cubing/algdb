import { Algset, User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateJoinableField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  description: "Algorithm Case",
  fields: {
    ...generateIdField(),
    name: generateStringField({ allowNull: false }),
    algset: generateJoinableField({
      allowNull: false,
      service: Algset,
    }),
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  },
};
