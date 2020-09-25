import { User, Tag, Alg } from '../../services'

import * as typeDefHelper from '../../../helpers/tier0/typeDef';

export default {
  ...typeDefHelper.generateIdField(),
  ...typeDefHelper.generateJoinableField({ service: Alg, mysqlOptions: { unique: "compositeIndex" } }),
  ...typeDefHelper.generateJoinableField({ service: Tag, mysqlOptions: { unique: "compositeIndex" } }),
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
}