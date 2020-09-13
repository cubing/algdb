import { User, Tag, Alg } from '../../services'

import { DataTypes } from "sequelize";
import { typeDefHelper } from '../../../jql';

export default {
  ...typeDefHelper.generateIdField(),
  ...typeDefHelper.generateJoinableField({ service: Alg, mysqlOptions: { unique: "compositeIndex" } }),
  ...typeDefHelper.generateJoinableField({ service: Tag, mysqlOptions: { unique: "compositeIndex" } }),
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
}