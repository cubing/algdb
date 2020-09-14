import { User } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from 'jamesql';

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