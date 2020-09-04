import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generateEnumField } from '../../helpers/tier0/typeDef';

import { User } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  ...generateIdField(),
  sequence: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
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
    filterable: true,
  },
}