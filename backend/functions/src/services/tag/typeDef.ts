import { User } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from 'jomql';

import * as typeDefHelper from '../../helpers/tier0/typeDef';

export default {
  ...typeDefHelper.generateIdField(),
  name: {
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
}