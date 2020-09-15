import { User } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from 'jomql';

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
}