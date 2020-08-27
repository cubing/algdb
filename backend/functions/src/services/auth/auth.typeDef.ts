import { User } from '../services'

import * as jwt from 'jsonwebtoken';

import { env } from '../../helpers/tier0/config'
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  type: {
    type: dataTypes.STRING,
    resolver: () => "Bearer"
  },
  token: {
    type: dataTypes.STRING,
    resolver: async (context, req, currentObject, query, args) => {
      return jwt.sign(
        {
          id: args.id,
          email: args.email,
        },
        env.general.jwt_secret,
        { expiresIn: '7d' },
      );
    }
  },
  user: {
    type: User.__typename,
    resolver: async (context, req, currentObject, query, args) => {
      return User.getRecord(req, {
        id: args.id
      }, query);
    }
  },
}