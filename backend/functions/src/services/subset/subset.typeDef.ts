import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generatePaginatorArgs } from '../../helpers/tier0/typeDef';

import { User, Puzzle, Algset, Subset, Algcase } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from '../../jql/helpers/dataType';

export default {
  ...generateIdField(),
  name: {
    type: dataTypes.STRING,
    mysqlOptions: {
      type: DataTypes.STRING,
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
  puzzle: {
    type: Puzzle.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Puzzle.__typename
      }
    },
    addable: true,
    filterable: true,
  },
  algset: {
    type: Algset.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Algset.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  parent: {
    type: Subset.__typename,
    allowNull: true,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      joinInfo: {
        type: Subset.__typename,
      },
    },
    addable: true,
    filterable: true,
  },
  algcases: {
    type: Algcase.__typename,
    args: generatePaginatorArgs(Algcase),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algcase.paginator.getRecord(req, {
        ...query?.__args,
        subset: currentObject.id
      }, query);
    }
  },
  subsets: {
    type: Subset.__typename,
    args: generatePaginatorArgs(Subset),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Subset.paginator.getRecord(req, {
        ...query?.__args,
        parent: currentObject.id
      }, query);
    }
  },
}