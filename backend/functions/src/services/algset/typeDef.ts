import { User, Puzzle, Algcase, Subset, CaseVisualizationEnum } from '../services'

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
      unique: "codePuzzleIndex",
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
  ...typeDefHelper.generateEnumField('visualization', CaseVisualizationEnum, {}, { defaultValue: CaseVisualizationEnum.enum["V_2D"] }),
  ...typeDefHelper.generateCreatedAtField(),
  ...typeDefHelper.generateUpdatedAtField(),
  ...typeDefHelper.generateCreatedByField(User),
  ...typeDefHelper.generateBooleanField("is_public"),
  ...typeDefHelper.generateJoinableField({ service: Puzzle, mysqlOptions: { unique: "codePuzzleIndex" } }),
  algcases: {
    type: Algcase.paginator.__typename,
    args: typeDefHelper.generatePaginatorArgs(Algcase, ["algset"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algcase.paginator.getRecord(req, {
        ...query?.__args,
        algset: currentObject.id
      }, query);
    }
  },
  subsets: {
    type: Subset.paginator.__typename,
    args: typeDefHelper.generatePaginatorArgs(Subset, ["algset"]),
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