import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generateEnumField, generateCreatedByField } from '../../helpers/tier0/typeDef';

import { User } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  ...generateIdField(),
  name: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addable: true,
  },
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
}