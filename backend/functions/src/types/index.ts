export type PusherEnv = {
  readonly app_id: string;
  readonly key: string;
  readonly secret: string;
  readonly cluster: string;
};

export type MysqlEnv = {
  readonly database: string;
  readonly user: string;
  readonly password: string;
  readonly socketpath?: string;
  readonly host?: string;
  readonly port?: string;
};

export type SqlWhereObject = {
  connective?: string;
  fields: (SqlWhereObject | SqlWhereFieldObject)[];
};

export type SqlJoinFieldObject = {
  table: string;
  field: string;
  foreignField: string;
};

export type SqlSelectFieldObject = SqlFieldObject & {
  field: string;
};

export type SqlWhereFieldObject = SqlFieldObject & {
  field: string;
  value: any;
  operator?: SqlWhereFieldOperator;
};

export type SqlWhereFieldOperator =
  | "eq"
  | "neq"
  | "in"
  | "nin"
  | "regex"
  | "like"
  | "gt"
  | "lt";

export type SqlSortFieldObject = SqlFieldObject & {
  field: string;
  desc?: boolean;
};

export type SqlGroupFieldObject = SqlFieldObject & {
  field: string;
};

export type SqlFieldObject = {
  //joinFields?: SqlJoinFieldObject[];
};

export type SqlQueryObject = SqlParams & {
  select: SqlQuerySelectObject[];
  from: string;
};

export type SqlQuerySelectObject = {
  field: string;
  as?: string;
  getter?: Function;
};

export type SqlParams = {
  rawSelect?: SqlQuerySelectObject[];
  where?: SqlWhereObject;
  limit?: number;
  groupBy?: SqlGroupFieldObject[];
  orderBy?: SqlSortFieldObject[];
};

export type SqlSelectQueryOutput = null | {
  [x: string]: any;
};

export type TypeDefSqlOptions = {
  joinInfo?: {
    type: string;
    foreignKey?: string;
  };
  getter?: (value: string) => string;
  joinHidden?: boolean;
  sqlDefinition: any;
};

export type TypeDefCustomOptions = {
  mysqlOptions: TypeDefSqlOptions;
  addable?: boolean;
  updateable?: boolean;
};

export type ExternalQuery = {
  [x: string]: any;
};
