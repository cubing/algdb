import { generateIdField, generateUpdatedAtField, generateCreatedAtField } from '../../helpers/tier0/typeDef';

import { User } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  ...generateIdField(),
  name: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  created_by: {
    type: User.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: User.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
}