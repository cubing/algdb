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
}

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
}