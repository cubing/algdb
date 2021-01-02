import { User, Algcase, Alg } from "../../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateJoinableField,
} from "../../../helpers/tier0/typeDef";

export default {
  ...generateIdField(),
  ...generateJoinableField({
    service: Alg,
    mysqlOptions: { unique: "compositeIndex" },
  }),
  ...generateJoinableField({
    service: Algcase,
    mysqlOptions: { unique: "compositeIndex" },
  }),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
};
