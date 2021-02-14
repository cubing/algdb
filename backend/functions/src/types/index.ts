import type { Request } from "express";
import { userPermissionEnum, userRoleKenum } from "../schema/enums";

export type StringKeyObject = Record<string, unknown>;

export type PusherEnv = {
  readonly app_id: string;
  readonly key: string;
  readonly secret: string;
  readonly cluster: string;
};

export type SqlEnv = {
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
  joinFields?: SqlJoinFieldObject[];
};

export type SqlQueryObject = SqlParams & {
  select: SqlQuerySelectObject[];
  from: string;
};

export type SqlQuerySelectObject = {
  field: string;
  as?: string;
  getter?: (val: string) => string;
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

export type ObjectTypeDefSqlOptions = {
  joinInfo?: {
    type: string;
    foreignKey?: string;
  };
  getter?: (value: string) => string;
  setter?: (value: string) => string;
  parseValue?: (value: unknown) => unknown; // performed before inserts/updates
  joinHidden?: boolean;
  sqlDefinition: SqlDefinition;
};

export type SqlDefinition = {
  type: SqlType;
  defaultValue?: any;
  unique?: boolean | string;
};

export type SqlType =
  | "string"
  | "integer"
  | "dateTime"
  | "text"
  | "float"
  | "decimal"
  | "boolean"
  | "json";

export type ExternalQuery = {
  [x: string]: any;
};

export type ServiceFunctionInputs = {
  req: Request;
  fieldPath: string[];
  args: unknown;
  query?: unknown;
  data?: any;
  isAdmin?: boolean;
};

export type ContextUser = {
  id: number;
  role: userRoleKenum | null;
  permissions: userPermissionEnum[];
};

export type AccessControlMap = {
  [x: string]: AccessControlFunction;
};

export type AccessControlFunction = (
  inputs: ServiceFunctionInputs
) => boolean | Promise<boolean>;

export type DataloaderFunctionInput = {
  req: Request;
  fieldPath: string[];
  args: unknown;
  query: unknown;
  currentObject: unknown;
  data: any;
};

export type DataloaderFunction = (
  input: DataloaderFunctionInput
) => Promise<unknown[]>;

export type PaginatorData = {
  rootArgs: StringKeyObject;
  records: StringKeyObject[];
};

export type CustomResolverFunction = (
  typename: string,
  req: Request,
  value: any,
  currentObject: any
) => any;
