import { generateIdField, generateUpdatedAtField, generateCreatedAtField } from '../../helpers/tier0/typeDef';

import { User, Puzzle, Algcase, Subset } from '../services'

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
  algcases: {
    type: Algcase.__typename,
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algcase.paginator.getRecord(req, {
        ...query?.__args,
        algset: currentObject.id
      }, query);
    }
  },
  subsets: {
    type: Subset.__typename,
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Subset.paginator.getRecord(req, {
        ...query?.__args,
        algset: currentObject.id
      }, query);
    }
  },
  score: {
    type: dataTypes.INTEGER,
    mysqlOptions: {
      type: DataTypes.INTEGER,
    },
    addable: true,
  }
}