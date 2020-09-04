import { generateIdField, generateUpdatedAtField, generateCreatedAtField } from '../../../helpers/tier0/typeDef';

import { User, Tag, Alg } from '../../services'

import { DataTypes } from "sequelize";

export default {
  ...generateIdField(),
  user: {
    type: User.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: User.__typename,
        unique: "compositeIndex"
      },
    },
    addable: true,
    filterable: true,
  },
  alg: {
    type: Alg.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Alg.__typename,
        unique: "compositeIndex"
      },
    },
    addable: true,
    filterable: true,
  },
  tag: {
    type: Tag.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Tag.__typename,
        unique: "compositeIndex"
      },
    },
    addable: true,
    filterable: true,
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