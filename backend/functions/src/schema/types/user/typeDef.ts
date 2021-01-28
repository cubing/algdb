// import * as bcrypt from "bcryptjs";

import { lookupSymbol, TypeDefinition } from "jomql";
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
import { userPermissionEnum } from "../../enums";

export default <TypeDefinition>{
  name: User.typename,
  description: "User type",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(User),
    provider: generateStringField({
      allowNull: false,
      mysqlOptions: { joinHidden: true },
      typeDefOptions: { addable: true, updateable: false },
      sqlDefinition: { unique: "compositeIndex" },
      hidden: true,
    }),
    provider_id: generateStringField({
      allowNull: false,
      mysqlOptions: { joinHidden: true },
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
      mysqlOptions: { joinHidden: true },
    }),
    permissions: generateArrayField({
      allowNull: true,
      type: Scalars.userPermission,
      mysqlOptions: { joinHidden: true },
    }),
    all_permissions: {
      type: Scalars.userPermission,
      isArray: true,
      allowNull: false,
      async resolver({ req, args, fieldPath, parentValue, fieldValue, data }) {
        let role = parentValue.role;
        let permissions = parentValue.permissions;
        // if either role or permissions not defined, fetch them
        if (!role || !permissions) {
          const results = await User.getRecord({
            req,
            fieldPath,
            args: { ...data.rootArgs },
            query: {
              role: lookupSymbol,
              permissions: lookupSymbol,
            },
            isAdmin: true,
            data,
          });

          // should always exist
          role = results.role;
          permissions = results.permissions;
        }

        let rolePermissionsArray = userRoleToPermissionsMap[role] ?? [];
        rolePermissionsArray = rolePermissionsArray.map(
          (ele) => userPermissionEnum[ele]
        );

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
};
