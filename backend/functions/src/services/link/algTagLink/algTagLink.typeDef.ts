import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generateCreatedByField } from '../../../helpers/tier0/typeDef';

import { User, Tag, Alg } from '../../services'

import { DataTypes } from "sequelize";

export default {
  ...generateIdField(),
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
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
}