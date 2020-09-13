import { User, Alg } from '../../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from '../../../jql';

export default {
  ...typeDefHelper.generateIdField(),
  user: {
    type: User.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      unique: "compositeIndex",
      allowNull: false,
      joinInfo: {
        type: User.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  alg: {
    type: Alg.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      unique: "compositeIndex",
      allowNull: false,
      joinInfo: {
        type: Alg.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  /*
  tag: {
    type: Tag.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Tag.__typename,
        allowNull: false,
        unique: "compositeIndex"
      },
    },
    addable: true,
    filterable: true,
  },
  */
  tag: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "compositeIndex",
    },
    addable: true,
    filterable: true,
  },
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
}