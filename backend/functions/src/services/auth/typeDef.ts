import { User } from '../services'

import * as jwt from 'jsonwebtoken';

import { env } from '../../config';
import { dataTypes } from 'jomql';

export default {
  type: {
    type: dataTypes.STRING,
    resolver: () => "Bearer"
  },
  token: {
    type: dataTypes.STRING,
    resolver: async (typename, req, currentObject, query, args) => {
      return jwt.sign(
        {
          id: args.id,
          email: args.email,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
        },
        env.general.jwt_secret,
      );
    }
  },
  expiration: {
    type: dataTypes.INTEGER,
    resolver: () => Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
  },
  user: {
    type: User.__typename,
    resolver: async (typename, req, currentObject, query, args) => {
      return User.getRecord(req, {
        id: args.id
      }, query);
    }
  },
}