import { User } from "../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateBooleanField,
} from "../../helpers/tier0/typeDef";
import { dataTypes, sequelizeDataTypes } from "jomql";

export default {
  ...generateIdField(),
  name: {
    type: dataTypes.STRING,
    allowNull: false,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  code: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
  ...generateBooleanField("is_public"),
};
