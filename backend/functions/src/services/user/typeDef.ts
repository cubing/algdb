import * as bcrypt from "bcryptjs";

import { generateError } from "../../helpers/tier0/error";
import { User, UserRole } from "../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateKenumField,
  generateBooleanField,
} from "../../helpers/tier0/typeDef";
import { dataTypes, sequelizeDataTypes, TypeDef } from "jomql";

export default <TypeDef>{
  ...generateIdField(),
  provider: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      unique: "compositeIndex",
    },
    addable: true,
    hidden: true,
  },
  provider_id: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      unique: "compositeIndex",
    },
    addable: true,
    hidden: true,
  },
  wca_id: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
    },
    addable: true,
  },
  email: {
    type: dataTypes.STRING,
    allowNull: false,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  password: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
    },
    addable: true,
    updateable: true,
    hidden: true,
    transform: {
      setter: (value) =>
        bcrypt.hash(value, 10).catch(() => {
          throw generateError("Invalid password");
        }),
    },
  },
  name: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  avatar: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  country: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: sequelizeDataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  ...generateBooleanField("is_public"),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
  ...generateKenumField(
    "role",
    UserRole,
    {},
    { defaultValue: UserRole.enum.NORMAL }
  ),
};
