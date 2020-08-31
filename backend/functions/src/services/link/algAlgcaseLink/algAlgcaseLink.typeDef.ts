import { generateIdField, generateUpdatedAtField, generateCreatedAtField } from '../../../helpers/tier0/typeDef';

import { User, Algcase, Alg } from '../../services'

import { DataTypes } from "sequelize";

export default {
  ...generateIdField(),
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
  algcase: {
    type: Algcase.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Algcase.__typename,
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
    addable: true,
    filterable: true,
  },
}