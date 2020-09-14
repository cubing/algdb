import { User, Alg } from '../../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from 'jamesql';

export default {
  ...typeDefHelper.generateIdField(),
  ...typeDefHelper.generateJoinableField({ service: User, mysqlOptions: { unique: "compositeIndex" } }),
  ...typeDefHelper.generateJoinableField({ service: Alg, mysqlOptions: { unique: "compositeIndex" } }),
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