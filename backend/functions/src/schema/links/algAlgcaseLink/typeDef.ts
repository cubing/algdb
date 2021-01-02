import { Alg, Algcase, User } from "../../services";
import { TypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateJoinableField,
} from "../../helpers/typeDef";

export default <TypeDefinition>{
  ...generateIdField(),
  alg: generateJoinableField({
    allowNull: false,
    service: Alg,
    sqlDefinition: { unique: "compositeIndex" },
  }),
  algcase: generateJoinableField({
    allowNull: false,
    service: Algcase,
    sqlDefinition: { unique: "compositeIndex" },
  }),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
};
