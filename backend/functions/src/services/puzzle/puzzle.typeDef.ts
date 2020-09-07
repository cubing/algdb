import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generateCreatedByField, generatePaginatorArgs, generateBooleanField } from '../../helpers/tier0/typeDef';

import { User, Algset } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  ...generateIdField(),
  name: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  code: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addable: true,
    updateable: true,
  },
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
  ...generateBooleanField("is_public"),
  algsets: {
    type: Algset.__typename,
    args: generatePaginatorArgs(Algset, ["puzzle"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algset.paginator.getRecord(req, {
        ...query?.__args,
        puzzle: currentObject.id
      }, query);
    }
  },
}