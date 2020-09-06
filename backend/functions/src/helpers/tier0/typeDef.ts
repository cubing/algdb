import { DataTypes, Sequelize } from 'sequelize';
import { dataTypes } from '../../jql/helpers/dataType';

export function generateCreatedAtField() {
  return {
    created_at: {
      type: dataTypes.DATETIME,
      mysqlOptions: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
    }
  };
};

export function generateUpdatedAtField() {
  return {
    updated_at: {
      type: dataTypes.DATETIME,
      allowNull: true,
      mysqlOptions: {
        type: DataTypes.DATE,
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
        setter: () => "CURRENT_TIMESTAMP"
      },
    }
  };
};

export function generateIdField() {
  return {
    id: {
      type: dataTypes.ID,
      mysqlOptions: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      filterable: true
    },
  };
};

export function generateCreatedByField(service: any) {
  return {
    created_by: {
      type: service.__typename,
      mysqlOptions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        joinInfo: {
          type: service.__typename,
        },
      },
      filterable: true,
    },
  };
};

export function generateEnumField(name: string, service: any, options?: object, mysqlOptions?: object) {
  return {
    [name]: {
      type: service.__typename,
      mysqlOptions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        ...mysqlOptions
      },
      resolver: async (context, req, currentObject, query, args, parent) => {
        return service.getRecord(req, {
          id: currentObject[name]
        }, query);
      },
      transform: {
        setter: (value) => {
          return service.enum[value];
        }
      },
      filterable: true,
      updateable: true,
      ...options
    },
  };
};

export function generatePaginatorArgs(service: any, excludeProperties: Array<string> = []) {
  const getArgs = {
    id: { type: dataTypes.ID },
    first: { type: dataTypes.INTEGER },
    after: { type: dataTypes.ID },
    search: { type: dataTypes.STRING },
    sortBy: { type: [dataTypes.STRING] },
    sortDesc: { type: [dataTypes.BOOLEAN] },
  };
  if(service.filterFieldsMap) {
    for(const field in service.filterFieldsMap) {
      if(!excludeProperties.includes(field)) {
        getArgs[field] = { type: dataTypes.STRING }
      }
    }
  }

  return getArgs;
};