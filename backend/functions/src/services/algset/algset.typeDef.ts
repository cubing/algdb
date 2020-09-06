import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generatePaginatorArgs, generateCreatedByField, generateEnumField } from '../../helpers/tier0/typeDef';

import { User, Puzzle, Algcase, Subset, CaseVisualizationEnum } from '../services'

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
  mask: {
    type: dataTypes.STRING,
    allowNull: true,
    mysqlOptions: {
      type: DataTypes.STRING,
    },
    addable: true,
    updateable: true,
  },
  ...generateEnumField('visualization', CaseVisualizationEnum, {}, { defaultValue: CaseVisualizationEnum.enum["V_2D"] }),
  ...generateCreatedAtField(),
  ...generateUpdatedAtField(),
  ...generateCreatedByField(User),
  puzzle: {
    type: Puzzle.__typename,
    mysqlOptions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      joinInfo: {
        type: Puzzle.__typename
      }
    },
    addable: true,
    filterable: true,
  },
  algcases: {
    type: Algcase.paginator.__typename,
    args: generatePaginatorArgs(Algcase, ["algset"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algcase.paginator.getRecord(req, {
        ...query?.__args,
        algset: currentObject.id
      }, query);
    }
  },
  subsets: {
    type: Subset.paginator.__typename,
    args: generatePaginatorArgs(Subset, ["algset"]),
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