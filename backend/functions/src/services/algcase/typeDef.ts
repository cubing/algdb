import { User, Puzzle, Algset, Subset, Alg } from '../services'

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
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
  ...typeDefHelper.generateJoinableField({ service: Puzzle }),
  ...typeDefHelper.generateJoinableField({ service: Algset }),
  ...typeDefHelper.generateJoinableField({ service: Subset, required: false }),
  algs: {
    type: Alg.paginator.__typename,
    args: typeDefHelper.generatePaginatorArgs(Alg, ["algcase"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Alg.paginator.getRecord(req, {
        ...query?.__args,
        algcase: currentObject.id
      }, query);
    }
  }
}