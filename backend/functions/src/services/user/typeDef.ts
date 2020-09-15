import * as bcrypt from 'bcryptjs';

import { User, UserRoleEnum } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from 'jomql';

export default {
  ...typeDefHelper.generateIdField(),
  provider: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: 'compositeIndex'
    },
    addable: true,
    hidden: true,
  },
  provider_id: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: 'compositeIndex'
    },
    addable: true,
    hidden: true,
  },
  wca_id: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: DataTypes.STRING
    },
    addable: true,
  },
  email: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    addable: true,
  },
  password: {
    type: dataTypes.STRING,
    allowNull: true,
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
    allowNull: true,
    mysqlOptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  avatar: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  country: {
    type: dataTypes.STRING,
    allowNull: true,
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
      defaultValue: true,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
  ...typeDefHelper.generateEnumField('role', UserRoleEnum, {}, { defaultValue: UserRoleEnum.enum["NORMAL"] }),
}