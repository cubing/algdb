import { DataTypes, Sequelize } from 'sequelize';
import { dataTypes } from '../../jql/helpers/dataType';

export function generateCreatedAtField() {
  return {
    created_at: {
      type: dataTypes.DATETIME,
      mysqlOptions: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
      addable: true,
      updateable: true
    }
  };
};

export function generateUpdatedAtField() {
  return {
    updated_at: {
      type: dataTypes.DATETIME,
      mysqlOptions: {
        type: DataTypes.DATE,
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
      updateable: true
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
        primaryKey: true
      },
      filterable: true
    },
  };
};

export function generateEnumField(name: string, service: any) {
  return {
    [name]: {
      type: service.__typename,
      mysqlOptions: {
        type: DataTypes.INTEGER,
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
    },
  };
};