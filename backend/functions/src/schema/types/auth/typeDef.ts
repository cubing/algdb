import { User } from "../../services";

import * as jwt from "jsonwebtoken";

import { env } from "../../../config";
import { BaseScalars } from "jomql";

const jwtExpirationDays = env.general.jwt_expiration
  ? parseInt(env.general.jwt_expiration)
  : 7;

export default {
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
    resolver: (req, args, query, typename, currentObject) => {
      return jwt.sign(
        {
          id: args.id,
          email: args.email,
          exp: Math.floor(Date.now() / 1000) + jwtExpirationDays * 24 * 60 * 60,
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
    resolver: (req, args, query, typename, currentObject) => {
      return User.getRecord(
        req,
        {
          id: args.id,
        },
        query,
        true
      );
    },
  },
};
