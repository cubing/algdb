import { Algcase, Algset, User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateJoinableField,
  generateTypenameField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  name: Algcase.typename,
  description: "Algorithm Case",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(Algcase),
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
