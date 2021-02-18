// import * as bcrypt from "bcryptjs";

import { JomqlObjectType, lookupSymbol, ObjectTypeDefinition } from "jomql";
import { User } from "../../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateEnumField,
  generateBooleanField,
  generateArrayField,
  generateTypenameField,
} from "../../helpers/typeDef";
import * as Scalars from "../../scalars";
import { userRoleToPermissionsMap } from "../../helpers/permissions";
import { userRoleKenum } from "../../enums";

export default new JomqlObjectType(<ObjectTypeDefinition>{
  name: User.typename,
  description: "User type",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(User),
    provider: generateStringField({
      allowNull: false,
      sqlOptions: { joinHidden: true },
      typeDefOptions: { addable: true, updateable: false },
      sqlDefinition: { unique: "compositeIndex" },
      hidden: true,
    }),
    provider_id: generateStringField({
      allowNull: false,
      sqlOptions: { joinHidden: true },
      typeDefOptions: { addable: true, updateable: false },
      sqlDefinition: { unique: "compositeIndex" },
      hidden: true,
    }),
    wca_id: generateStringField({
      allowNull: true,
      typeDefOptions: { addable: true, updateable: false },
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
    country: generateStringField({
      allowNull: true,
    }),
    is_public: generateBooleanField({
      allowNull: false,
      defaultValue: true,
    }),
    role: generateEnumField({
      scalarDefinition: Scalars.userRole,
      allowNull: false,
      defaultValue: "NONE",
      sqlOptions: { joinHidden: true },
      isKenum: true,
    }),
    permissions: generateArrayField({
      allowNull: true,
      type: Scalars.userPermission,
      sqlOptions: { joinHidden: true },
    }),
    all_permissions: {
      type: Scalars.userPermission,
      arrayOptions: {
        allowNullElement: false,
      },
      requiredSqlFields: ["role", "permissions"],
      allowNull: false,
      async resolver({ parentValue }) {
        const role = parentValue.role;
        const permissions = parentValue.permissions;

        // convert role to name
        const roleName = userRoleKenum.fromIndex(role).name;

        const rolePermissionsArray = (
          userRoleToPermissionsMap[roleName] ?? []
        ).map((ele) => ele.name);

        const permissionsArray = permissions ?? [];

        // fetch the user role IF it is not provided
        return rolePermissionsArray.concat(permissionsArray);
      },
    },
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
  },
});
