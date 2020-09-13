import { User, Puzzle, Algset, Subset, AlgAlgcaseLink } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes, typeDefHelper } from '../../jql';

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
  puzzle: {
    type: Puzzle.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      joinInfo: {
        type: Puzzle.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  algset: {
    type: Algset.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      joinInfo: {
        type: Algset.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  subset: {
    type: Subset.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Subset.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  algs: {
    type: AlgAlgcaseLink.paginator.__typename,
    args: typeDefHelper.generatePaginatorArgs(AlgAlgcaseLink, ["algcase"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return AlgAlgcaseLink.paginator.getRecord(req, {
        ...query?.__args,
        algcase: currentObject.id
      }, query);
    }
  }
}