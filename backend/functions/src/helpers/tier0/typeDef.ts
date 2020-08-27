import { DataTypes } from 'sequelize';
import { dataTypes } from '../../jql/helpers/dataType';

export function generateDateModifiedField() {
  return {
    date_created: {
      type: dataTypes.DATETIME,
      mysqlOptions: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
      addable: true,
      updateable: true
    }
  };
}

export function generateDateCreatedField() {
  return {
    date_modified: {
      type: dataTypes.DATETIME,
      mysqlOptions: {
        type: DataTypes.DATE,
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
      updateable: true
    }
  };
}