import { User, Algset } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from 'jomql';

export default {
  ...typeDefHelper.generateIdField(),
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
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
  ...typeDefHelper.generateBooleanField("is_public"),
  algsets: {
    type: Algset.__typename,
    args: typeDefHelper.generatePaginatorArgs(Algset, ["puzzle"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algset.paginator.getRecord(req, {
        ...query?.__args,
        puzzle: currentObject.id
      }, query);
    }
  },
}