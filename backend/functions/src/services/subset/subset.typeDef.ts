import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generatePaginatorArgs, generateCreatedByField, generateEnumField, generateBooleanField } from '../../helpers/tier0/typeDef';

import { User, Puzzle, Algset, Subset, Algcase, CaseVisualizationEnum } from '../services'

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
  ...generateBooleanField("is_public"),
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
    args: generatePaginatorArgs(Algcase, ["subset"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Algcase.paginator.getRecord(req, {
        ...query?.__args,
        subset: currentObject.id
      }, query);
    }
  },
  subsets: {
    type: Subset.__typename,
    args: generatePaginatorArgs(Subset, ["parent"]),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return Subset.paginator.getRecord(req, {
        ...query?.__args,
        parent: currentObject.id
      }, query);
    }
  },
}