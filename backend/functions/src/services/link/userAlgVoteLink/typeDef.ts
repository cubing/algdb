import { User, Alg } from '../../services'

import { DataTypes } from "sequelize";
import { dataTypes } from 'jomql';

import * as typeDefHelper from '../../../helpers/tier0/typeDef';

export default {
  ...typeDefHelper.generateIdField(),
  ...typeDefHelper.generateJoinableField({ service: User, mysqlOptions: { unique: "compositeIndex" } }),
  ...typeDefHelper.generateJoinableField({ service: Alg, mysqlOptions: { unique: "compositeIndex" } }),
  vote_value: {
    type: dataTypes.INTEGER,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
}