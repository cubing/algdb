import { User, Puzzle, Algset, Subset, Algcase, CaseVisualizationEnum } from '../services'

import { DataTypes } from "sequelize";
import { dataTypes } from 'jomql';

import * as typeDefHelper from '../../helpers/tier0/typeDef';

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
      unique: "codeAlgsetIndex",
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
  ...typeDefHelper.generateJoinableField({ service: Puzzle }),
  ...typeDefHelper.generateJoinableField({ service: Algset, mysqlOptions: { unique: "codeAlgsetIndex" } }),
  ...typeDefHelper.generateJoinableField({ name: "parent", service: Subset, mysqlOptions: {}, required: false }),
  algcases: {
    type: Algcase.paginator.__typename,
    args: typeDefHelper.generatePaginatorArgs(Algcase, ["subset"]),
    resolver: async (typename, req, currentObject, query, args, parent) => {
      return Algcase.paginator.getRecord(req, {
        ...query?.__args,
        subset: currentObject.id
      }, query);
    }
  },
  subsets: {
    type: Subset.paginator.__typename,
    args: typeDefHelper.generatePaginatorArgs(Subset, ["parent"]),
    resolver: async (typename, req, currentObject, query, args, parent) => {
      return Subset.paginator.getRecord(req, {
        ...query?.__args,
        parent: currentObject.id
      }, query);
    }
  },
}