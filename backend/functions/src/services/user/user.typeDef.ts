import * as bcrypt from 'bcryptjs';

import firestoreHelper from '../../helpers/tier1/firestore';

import { generateUpdatedAtField, generateCreatedAtField } from '../../helpers/tier0/typeDef';

import { User, UserRoleEnum } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  id: {
    type: dataTypes.ID,
    mysqlOptions: {
      type: DataTypes.INTEGER,
    },
    filterable: true
  },
  provider: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: 'compositeIndex'
    },
    addable: true,
  },
  provider_id: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: 'compositeIndex'
    },
    addable: true,
  },
  wca_id: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING
    },
    addable: true,
  },
  email: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: true
    },
    addable: true,
  },
  password: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
    updateable: false,
    hidden: true,
    transform: {
      setter: async (value) => await bcrypt.hash(value, 10)
    }
  },
  name: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  is_public: {
    type: dataTypes.BOOLEAN,
    mysqlOptions: {
      type: DataTypes.BOOLEAN,
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
  role: {
    type: UserRoleEnum.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
    },
    resolver: async (context, req, currentObject, query, args, parent) => {
      return UserRoleEnum.getRecord(req, {
        id: currentObject.role
      }, query);
    },
    filterable: true
  },
}