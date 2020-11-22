import { User, UserAlgVoteLink } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from 'jomql';

import * as typeDefHelper from '../../helpers/tier0/typeDef';

export default {
  ...typeDefHelper.generateIdField(),
  sequence: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addable: true,
  },
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
  ...typeDefHelper.generateBooleanField("is_approved", {}, { defaultValue: false }),
  score: {
    type: dataTypes.INTEGER,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  },
  current_user_vote: {
    type: UserAlgVoteLink.__typename,
    resolver: async (typename, req, currentObject, query, args, parent) => {
      if(!req.user) return null;
      
      return UserAlgVoteLink.getRecord(req, {
        ...query?.__args,
        user: req.user.id,
        alg: currentObject.id,
      }, query).catch(e => null);
    }
  }
}