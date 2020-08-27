import * as bcrypt from 'bcryptjs';

import firestoreHelper from '../../helpers/tier1/firestore';

import { generateDateModifiedField, generateDateCreatedField } from '../../helpers/tier0/typeDef';

import { User } from '../services'

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
  social_login_id: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: true
    },
    addable: true,
    updateable: false
  },
  wca_id: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING
    },
    addable: true,
    updateable: false
  },
  email: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: true
    },
    addable: true,
    updateable: false
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
      defaultValue: "John Doe",
    },
    addable: true,
    updateable: true,
  },
  ...generateDateCreatedField(),
  ...generateDateModifiedField(),
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