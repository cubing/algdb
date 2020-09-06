import { generateIdField, generateUpdatedAtField, generateCreatedAtField, generateEnumField, generatePaginatorArgs, generateCreatedByField } from '../../helpers/tier0/typeDef';

import { User, Puzzle, Algset, Subset, AlgAlgcaseLink, CaseVisualizationEnum } from '../services'

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
    args: generatePaginatorArgs(AlgAlgcaseLink),
    resolver: async (context, req, currentObject, query, args, parent) => {
      return AlgAlgcaseLink.paginator.getRecord(req, {
        ...query?.__args,
        algcase: currentObject.id
      }, query);
    }
  }
}