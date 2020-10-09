import { DataTypes, Sequelize } from 'sequelize';
import { dataTypes, mysqlHelper } from 'jomql';

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
      updateable: true,
      mysqlOptions: {
        type: DataTypes.DATE,
        allowNull: true,
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
      transform: {
        setter: () => mysqlHelper.getMysqlRaw('CURRENT_TIMESTAMP()')
      }
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
  return generateJoinableField({ name: "created_by", service });
};

export function generateJoinableField(args: {
  name?: string,
  service: any,
  options?: object,
  mysqlOptions?: object,
  required?: boolean
}) {
  const {
    name,
    service,
    options,
    mysqlOptions,
    required = true
  } = args
  return {
    [name ?? service.__typename]: {
      type: service.__typename,
      mysqlOptions: {
        type: DataTypes.INTEGER,
        joinInfo: {
          type: service.__typename,
        },
        ...mysqlOptions,
        allowNull: !required
      },
      addable: true,
      filterable: true,
      ...options,
      allowNull: !required,
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
      resolver: async (typename, req, currentObject, query, args, parent) => {
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
      addable: true,
      ...options
    },
  };
};

export function generateBooleanField(name: string, options?: object, mysqlOptions?: object) {
  return {
    [name]: {
      type: dataTypes.BOOLEAN,
      mysqlOptions: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        ...mysqlOptions
      },
      transform: {
        getter: (value) => value === 1
      },
      addable: true,
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