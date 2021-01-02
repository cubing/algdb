// import * as bcrypt from "bcryptjs";

import { TypeDefinition } from "jomql";
import { User } from "../../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateEnumField,
} from "../../helpers/typeDef";
import * as Scalars from "../../scalars";

export default <TypeDefinition>{
  ...generateIdField(),
  provider: generateStringField({
    allowNull: false,
    mysqlOptions: { joinHidden: true },
    customOptions: { addable: true, updateable: false },
    sqlDefinition: { unique: "compositeIndex" },
    hidden: true,
  }),
  provider_id: generateStringField({
    allowNull: false,
    mysqlOptions: { joinHidden: true },
    customOptions: { addable: true, updateable: false },
    sqlDefinition: { unique: "compositeIndex" },
    hidden: true,
  }),
  wca_id: generateStringField({
    allowNull: true,
    customOptions: { addable: true, updateable: false },
  }),
  email: generateStringField({
    allowNull: false,
    sqlDefinition: { unique: true },
  }),
  name: generateStringField({
    allowNull: false,
  }),
  avatar: generateStringField({
    allowNull: true,
  }),
  role: generateEnumField({
    scalarDefinition: Scalars.userRole,
    allowNull: false,
    defaultValue: "NONE",
  }),
  /*
  // using wca auth
  password: {
    type: dataTypes.STRING,
    isArray: false,
    allowNull: true,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
    updateable: true,
    hidden: true,
    transform: {
      setter: (value) =>
        bcrypt.hash(value, 10).catch(() => {
          throw new Error("Invalid password");
        }),
    },
  },
  */
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
};
