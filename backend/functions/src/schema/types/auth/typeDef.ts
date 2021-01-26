import { User, Auth } from "../../services";

import * as jwt from "jsonwebtoken";
import { generateTypenameField } from "../../helpers/typeDef";
import { env } from "../../../config";
import { BaseScalars, TypeDefinition } from "jomql";

const jwtExpirationDays = env.general.jwt_expiration
  ? parseInt(env.general.jwt_expiration)
  : 7;

export default <TypeDefinition>{
  name: Auth.typename,
  description: "Authentication type",
  fields: {
    ...generateTypenameField(Auth),
    type: {
      type: BaseScalars.string,
      isArray: false,
      allowNull: false,
      resolver: () => "Bearer",
    },
    token: {
      type: BaseScalars.string,
      isArray: false,
      allowNull: false,
      resolver: ({ data }) => {
        return jwt.sign(
          {
            id: data.id,
            email: data.email,
            exp:
              Math.floor(Date.now() / 1000) + jwtExpirationDays * 24 * 60 * 60,
          },
          env.general.jwt_secret
        );
      },
    },
    expiration: {
      type: BaseScalars.number,
      isArray: false,
      allowNull: false,
      resolver: () =>
        Math.floor(Date.now() / 1000) + jwtExpirationDays * 24 * 60 * 60,
    },
    expiration_days: {
      type: BaseScalars.number,
      isArray: false,
      allowNull: false,
      resolver: () => jwtExpirationDays,
    },
    user: {
      type: User.typename,
      isArray: false,
      allowNull: false,
      resolver: ({ req, args, query, fieldPath }) => {
        return User.getRecord({
          req,
          args,
          query,
          fieldPath,
          isAdmin: true,
        });
      },
    },
  },
};
