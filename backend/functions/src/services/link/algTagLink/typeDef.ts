import { User, Tag, Alg } from '../../services'

import { DataTypes } from "sequelize";
import { typeDefHelper } from '../../../jql';

export default {
  ...typeDefHelper.generateIdField(),
  alg: {
    type: Alg.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "compositeIndex",
      joinInfo: {
        type: Alg.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  tag: {
    type: Tag.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "compositeIndex",
      joinInfo: {
        type: Tag.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
}