import {
  dataTypes,
  mysqlHelper,
  sequelizeDataTypes,
  Sequelize,
  TypeDef,
} from "jomql";

export function generateCreatedAtField(): TypeDef {
  return {
    created_at: {
      type: dataTypes.DATETIME,
      allowNull: false,
      mysqlOptions: {
        type: sequelizeDataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
    },
  };
}

export function generateUpdatedAtField(): TypeDef {
  return {
    updated_at: {
      type: dataTypes.DATETIME,
      allowNull: true,
      updateable: true,
      mysqlOptions: {
        type: sequelizeDataTypes.DATE,
        allowNull: true,
        getter: (field) => "UNIX_TIMESTAMP(" + field + ")",
      },
      transform: {
        setter: () => mysqlHelper.getMysqlRaw("CURRENT_TIMESTAMP()"),
      },
    },
  };
}

export function generateIdField(): TypeDef {
  return {
    id: {
      type: dataTypes.ID,
      allowNull: false,
      mysqlOptions: {
        type: sequelizeDataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      filterable: true,
    },
  };
}

export function generateCreatedByField(service: any) {
  return generateJoinableField({ name: "created_by", service });
}

export function generateJoinableField(args: {
  name?: string;
  service: any;
  options?: object;
  mysqlOptions?: object;
  required?: boolean;
}): TypeDef {
  const { name, service, options, mysqlOptions, required = true } = args;
  return {
    [name?.toLowerCase() ?? service.__typename.toLowerCase()]: {
      type: service.__typename,
      mysqlOptions: {
        type: sequelizeDataTypes.INTEGER,
        joinInfo: {
          type: service.__typename,
        },
        ...mysqlOptions,
        allowNull: !required,
      },
      addable: true,
      filterable: true,
      updateable: true,
      ...options,
      allowNull: !required,
    },
  };
}

export function generateKenumField(
  name: string,
  service: any,
  options?: any,
  mysqlOptions?: object
): TypeDef {
  return {
    [name]: {
      type: service.__typename,
      allowNull: false,
      mysqlOptions: {
        type: sequelizeDataTypes.INTEGER,
        allowNull: false,
        ...mysqlOptions,
      },
      resolver: async (req, args, query, typename, currentObject) => {
        return service.getRecord(
          req,
          {
            id: currentObject[name],
          },
          query
        );
      },
      transform: {
        setter: (value) => {
          if (Number.isNaN(parseInt(value)) || !(value in service.enum))
            throw Error("Invalid enum");
          return value;
        },
      },
      filterable: true,
      updateable: true,
      addable: true,
      ...options,
    },
  };
}

export function generateEnumField(
  name: string,
  service: any,
  options?: any,
  mysqlOptions?: object
): TypeDef {
  return {
    [name]: {
      type: service.__typename,
      allowNull: false,
      mysqlOptions: {
        type: sequelizeDataTypes.STRING,
        allowNull: false,
        ...mysqlOptions,
      },
      transform: {
        setter: (value) => {
          if (!Number.isNaN(parseInt(value)) || !(value in service.enum))
            throw Error("Invalid enum");
          return value;
        },
      },
      filterable: true,
      updateable: true,
      addable: true,
      ...options,
    },
  };
}

export function generateBooleanField(
  name: string,
  options?: any,
  mysqlOptions?: object
): TypeDef {
  return {
    [name]: {
      type: dataTypes.BOOLEAN,
      allowNull: false,
      mysqlOptions: {
        type: sequelizeDataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        ...mysqlOptions,
      },
      transform: {
        getter: (value) => value === 1,
      },
      addable: true,
      updateable: true,
      ...options,
    },
  };
}

export function generatePaginatorArgs(
  service: any,
  excludeProperties: Array<string> = []
) {
  const getArgs = {
    id: { type: dataTypes.ID },
    first: { type: dataTypes.INTEGER },
    after: { type: dataTypes.ID },
    search: { type: dataTypes.STRING },
    sortBy: { type: [dataTypes.STRING] },
    sortDesc: { type: [dataTypes.BOOLEAN] },
  };
  if (service.filterFieldsMap) {
    for (const field in service.filterFieldsMap) {
      if (!excludeProperties.includes(field)) {
        getArgs[field] = { type: dataTypes.STRING };
      }
    }
  }

  return getArgs;
}
