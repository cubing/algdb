import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generateCreatedByField } from '../../../helpers/tier0/typeDef';

import { User, Tag, Alg } from '../../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../../jql/helpers/dataType';

export default {
  ...generateIdField(),
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
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
}