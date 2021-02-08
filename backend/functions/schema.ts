// Query builder (Typescript version >= 4.1.3 required)
/* const queryResult = executeJomql({
  // Start typing here to get hints
}); */

export function executeJomql<Key extends keyof Root>(
  query: GetQuery<Key>
): GetResponse<Key> {
  let data: any;
  return data;
}

// scaffolding
export type GetQuery<K extends keyof Root> = K extends never
  ? Partial<Record<K, Queryize<Root[keyof Root]>>>
  : Record<K, Queryize<Root[K]>>;

export type GetResponse<K extends keyof Root> = Responseize<Root[K]>;

type Primitive = string | number | boolean | undefined | null;

type Field<T, K> = {
  Type: T;
  Args: K;
};

type Responseize<T> = T extends Field<infer Type, infer Args>
  ? Type extends never
    ? never
    : Type extends (infer U)[]
    ? { [P in keyof U]: Responseize<U[P]> }[]
    : { [P in keyof Type]: Responseize<Type[P]> }
  : never;

type Queryize<T> = T extends Field<infer Type, infer Args>
  ? Type extends never
    ? never
    : Type extends Primitive
    ? Args extends undefined // Args is undefined
      ? LookupValue
      : Args extends [infer Arg]
      ? LookupValue | { __args: Arg } // Args is a tuple
      : { __args: Args }
    : Type extends (infer U)[]
    ? Queryize<Field<U, Args>>
    : Args extends undefined // Args is undefined
    ? { [P in keyof Type]?: Queryize<Type[P]> }
    : Args extends [infer Arg]
    ? { [P in keyof Type]?: Queryize<Type[P]> } & {
        __args?: Arg;
      }
    : { [P in keyof Type]?: Queryize<Type[P]> } & { __args: Args }
  : never;

type LookupValue = true;

type Edge<T> = {
  __typename: Field<string, undefined>;
  node: Field<T, undefined>;
  cursor: Field<string, undefined>;
};

/**All Scalar values*/ export type Scalars = {
  /**String value*/ string: string;
  /**True or False*/ boolean: boolean;
  /**Numeric value*/ number: number;
  /**Unknown value*/ unknown: unknown;
  /**Image URL Field*/ imageUrl: string;
  /**UNIX Timestamp (Seconds since Epoch Time)*/ unixTimestamp: number;
  /**Valid generic JSON that is stored in database as string*/ jsonAsString: unknown;
  /**ID Field*/ id: number;
  /**Enum stored as a separate key value*/ userRole:
    | "NONE"
    | "NORMAL"
    | "ADMIN";
  /**Enum stored as is*/ filterOperator:
    | "eq"
    | "neq"
    | "gt"
    | "lt"
    | "in"
    | "nin"
    | "regex"
    | "like";
  /**Enum stored as is*/ caseVisualization: "V_2D" | "V_3D" | "V_PG3D";
  /**Enum stored as is*/ userPermission:
    | "A_A"
    | "user_x"
    | "user_get"
    | "user_getMultiple"
    | "user_update"
    | "user_create"
    | "user_delete";
  userSortByKey: "id" | "created_at" | "updated_at";
  userGroupByKey: undefined;
  puzzleSortByKey: "id" | "created_at";
  puzzleGroupByKey: undefined;
  algsetSortByKey: "id" | "created_at";
  algsetGroupByKey: undefined;
  algcaseSortByKey: "id" | "created_at";
  algcaseGroupByKey: undefined;
  algSortByKey: "id" | "created_at";
  algGroupByKey: "id";
  tagSortByKey: "id" | "created_at";
  tagGroupByKey: "id";
};
/**All Input types*/ export type InputType = {
  getUser: { id?: Scalars["id"] };
  "userFilterByField/id": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "userFilterByField/created_by": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "userFilterByField/created_by.name": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  "userFilterByField/role": {
    operator?: Scalars["filterOperator"];
    value: Scalars["userRole"];
  };
  "userFilterByField/name": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  userFilterByObject: {
    id?: InputType["userFilterByField/id"][];
    created_by?: InputType["userFilterByField/created_by"][];
    "created_by.name"?: InputType["userFilterByField/created_by.name"][];
    role?: InputType["userFilterByField/role"][];
    name?: InputType["userFilterByField/name"][];
  };
  getUserPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["userSortByKey"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["userFilterByObject"];
    groupBy?: Scalars["userGroupByKey"][];
    search?: Scalars["string"];
  };
  createUser: {
    provider: Scalars["string"];
    provider_id: Scalars["string"];
    wca_id?: Scalars["string"] | null;
    email: Scalars["string"];
    name: Scalars["string"];
    avatar?: Scalars["string"] | null;
    country?: Scalars["string"] | null;
    is_public?: Scalars["boolean"];
    role?: Scalars["userRole"];
    permissions?: Scalars["userPermission"][] | null;
  };
  updateUserFields: {
    email?: Scalars["string"];
    name?: Scalars["string"];
    avatar?: Scalars["string"] | null;
    country?: Scalars["string"] | null;
    is_public?: Scalars["boolean"];
    role?: Scalars["userRole"];
    permissions?: Scalars["userPermission"][] | null;
  };
  updateUser: {
    item: InputType["getUser"];
    fields: InputType["updateUserFields"];
  };
  socialLogin: {
    provider: Scalars["string"];
    code: Scalars["string"];
    redirect_uri: Scalars["string"];
  };
  getPuzzle: { id?: Scalars["id"]; code?: Scalars["string"] };
  "puzzleFilterByField/id": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "puzzleFilterByField/created_by": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "puzzleFilterByField/code": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  "puzzleFilterByField/is_public": {
    operator?: Scalars["filterOperator"];
    value: Scalars["boolean"];
  };
  puzzleFilterByObject: {
    id?: InputType["puzzleFilterByField/id"][];
    created_by?: InputType["puzzleFilterByField/created_by"][];
    code?: InputType["puzzleFilterByField/code"][];
    is_public?: InputType["puzzleFilterByField/is_public"][];
  };
  getPuzzlePaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["puzzleSortByKey"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["puzzleFilterByObject"];
    groupBy?: Scalars["puzzleGroupByKey"][];
    search?: Scalars["string"];
  };
  createPuzzle: {
    name: Scalars["string"];
    code: Scalars["string"];
    is_public?: Scalars["boolean"];
  };
  updatePuzzleFields: {
    name?: Scalars["string"];
    code?: Scalars["string"];
    is_public?: Scalars["boolean"];
  };
  updatePuzzle: {
    item: InputType["getPuzzle"];
    fields: InputType["updatePuzzleFields"];
  };
  getAlgset: { id?: Scalars["id"]; code?: Scalars["string"] };
  "algsetFilterByField/id": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algsetFilterByField/created_by": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algsetFilterByField/code": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  "algsetFilterByField/is_public": {
    operator?: Scalars["filterOperator"];
    value: Scalars["boolean"];
  };
  "algsetFilterByField/name": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  "algsetFilterByField/puzzle": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algsetFilterByField/parent": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"] | null;
  };
  algsetFilterByObject: {
    id?: InputType["algsetFilterByField/id"][];
    created_by?: InputType["algsetFilterByField/created_by"][];
    code?: InputType["algsetFilterByField/code"][];
    is_public?: InputType["algsetFilterByField/is_public"][];
    name?: InputType["algsetFilterByField/name"][];
    puzzle?: InputType["algsetFilterByField/puzzle"][];
    parent?: InputType["algsetFilterByField/parent"][];
  };
  getAlgsetPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["algsetSortByKey"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["algsetFilterByObject"];
    groupBy?: Scalars["algsetGroupByKey"][];
    search?: Scalars["string"];
  };
  createAlgset: {
    name: Scalars["string"];
    code: Scalars["string"];
    parent?: InputType["getAlgset"] | null;
    puzzle: InputType["getPuzzle"];
    mask?: Scalars["string"] | null;
    visualization?: Scalars["caseVisualization"];
    score?: Scalars["number"];
    is_public?: Scalars["boolean"];
  };
  updateAlgsetFields: {
    name?: Scalars["string"];
    code?: Scalars["string"];
    parent?: InputType["getAlgset"] | null;
    puzzle?: InputType["getPuzzle"];
    mask?: Scalars["string"] | null;
    visualization?: Scalars["caseVisualization"];
    score?: Scalars["number"];
    is_public?: Scalars["boolean"];
  };
  updateAlgset: {
    item: InputType["getAlgset"];
    fields: InputType["updateAlgsetFields"];
  };
  getAlgcase: { id?: Scalars["id"] };
  "algcaseFilterByField/id": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algcaseFilterByField/created_by": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algcaseFilterByField/algset": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  algcaseFilterByObject: {
    id?: InputType["algcaseFilterByField/id"][];
    created_by?: InputType["algcaseFilterByField/created_by"][];
    algset?: InputType["algcaseFilterByField/algset"][];
  };
  getAlgcasePaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["algcaseSortByKey"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["algcaseFilterByObject"];
    groupBy?: Scalars["algcaseGroupByKey"][];
    search?: Scalars["string"];
  };
  createAlgcase: { name: Scalars["string"]; algset: InputType["getAlgset"] };
  updateAlgcaseFields: {
    name?: Scalars["string"];
    algset?: InputType["getAlgset"];
  };
  updateAlgcase: {
    item: InputType["getAlgcase"];
    fields: InputType["updateAlgcaseFields"];
  };
  getAlg: { id?: Scalars["id"] };
  "algFilterByField/id": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algFilterByField/algcase.name": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  "algFilterByField/algcase": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algFilterByField/tag": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "algFilterByField/tag.name": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  algFilterByObject: {
    id?: InputType["algFilterByField/id"][];
    "algcase.name"?: InputType["algFilterByField/algcase.name"][];
    algcase?: InputType["algFilterByField/algcase"][];
    tag?: InputType["algFilterByField/tag"][];
    "tag.name"?: InputType["algFilterByField/tag.name"][];
  };
  getAlgPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["algSortByKey"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["algFilterByObject"];
    groupBy?: Scalars["algGroupByKey"][];
    search?: Scalars["string"];
  };
  createAlg: {
    sequence: Scalars["string"];
    is_approved?: Scalars["boolean"];
    score?: Scalars["number"];
  };
  updateAlgFields: {
    sequence?: Scalars["string"];
    is_approved?: Scalars["boolean"];
    score?: Scalars["number"];
  };
  updateAlg: {
    item: InputType["getAlg"];
    fields: InputType["updateAlgFields"];
  };
  getTag: { id?: Scalars["id"] };
  "tagFilterByField/id": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "tagFilterByField/alg": {
    operator?: Scalars["filterOperator"];
    value: Scalars["id"];
  };
  "tagFilterByField/name": {
    operator?: Scalars["filterOperator"];
    value: Scalars["string"];
  };
  tagFilterByObject: {
    id?: InputType["tagFilterByField/id"][];
    alg?: InputType["tagFilterByField/alg"][];
    name?: InputType["tagFilterByField/name"][];
  };
  getTagPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["tagSortByKey"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["tagFilterByObject"];
    groupBy?: Scalars["tagGroupByKey"][];
    search?: Scalars["string"];
  };
  createTag: { name: Scalars["string"] };
  getAlgAlgcaseLink: { id?: Scalars["id"] };
  createAlgAlgcaseLink: {
    alg: InputType["getAlg"];
    algcase: InputType["getAlgcase"];
  };
  getAlgTagLink: { id?: Scalars["id"] };
  createAlgTagLink: { alg: InputType["getAlg"]; tag: InputType["getTag"] };
};
/**PaginatorInfo Type*/ export type PaginatorInfo = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  total: { Type: Scalars["number"]; Args: undefined };
  count: { Type: Scalars["number"]; Args: undefined };
  startCursor: { Type: Scalars["string"] | null; Args: undefined };
  endCursor: { Type: Scalars["string"] | null; Args: undefined };
};
export type UserEdge = Edge<User>;
/**Paginator*/ export type UserPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  paginatorInfo: { Type: PaginatorInfo; Args: undefined };
  edges: { Type: UserEdge[]; Args: undefined };
};
export type PuzzleEdge = Edge<Puzzle>;
/**Paginator*/ export type PuzzlePaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  paginatorInfo: { Type: PaginatorInfo; Args: undefined };
  edges: { Type: PuzzleEdge[]; Args: undefined };
};
export type AlgsetEdge = Edge<Algset>;
/**Paginator*/ export type AlgsetPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  paginatorInfo: { Type: PaginatorInfo; Args: undefined };
  edges: { Type: AlgsetEdge[]; Args: undefined };
};
export type AlgcaseEdge = Edge<Algcase>;
/**Paginator*/ export type AlgcasePaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  paginatorInfo: { Type: PaginatorInfo; Args: undefined };
  edges: { Type: AlgcaseEdge[]; Args: undefined };
};
export type AlgEdge = Edge<Alg>;
/**Paginator*/ export type AlgPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  paginatorInfo: { Type: PaginatorInfo; Args: undefined };
  edges: { Type: AlgEdge[]; Args: undefined };
};
export type TagEdge = Edge<Tag>;
/**Paginator*/ export type TagPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  paginatorInfo: { Type: PaginatorInfo; Args: undefined };
  edges: { Type: TagEdge[]; Args: undefined };
};
/**Link type*/ export type AlgAlgcaseLink = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  alg: { Type: Alg; Args: undefined };
  algcase: { Type: Algcase; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**Link type*/ export type AlgTagLink = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  alg: { Type: Alg; Args: undefined };
  tag: { Type: Tag; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**EnumPaginator*/ export type UserRoleEnumPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  values: { Type: Scalars["userRole"][]; Args: undefined };
};
/**EnumPaginator*/ export type FilterOperatorEnumPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  values: { Type: Scalars["filterOperator"][]; Args: undefined };
};
/**EnumPaginator*/ export type CaseVisualizationEnumPaginator = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  values: { Type: Scalars["caseVisualization"][]; Args: undefined };
};
/**User type*/ export type User = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  provider: { Type: never; Args: undefined };
  provider_id: { Type: never; Args: undefined };
  wca_id: { Type: Scalars["string"] | null; Args: undefined };
  email: { Type: Scalars["string"]; Args: undefined };
  name: { Type: Scalars["string"]; Args: undefined };
  avatar: { Type: Scalars["string"] | null; Args: undefined };
  country: { Type: Scalars["string"] | null; Args: undefined };
  is_public: { Type: Scalars["boolean"]; Args: undefined };
  role: { Type: Scalars["userRole"]; Args: undefined };
  permissions: { Type: Scalars["userPermission"][] | null; Args: undefined };
  all_permissions: { Type: Scalars["userPermission"][]; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**Authentication type*/ export type Auth = {
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  type: { Type: Scalars["string"]; Args: undefined };
  token: { Type: Scalars["string"]; Args: undefined };
  expiration: { Type: Scalars["number"]; Args: undefined };
  expiration_days: { Type: Scalars["number"]; Args: undefined };
  user: { Type: User; Args: undefined };
};
/**Puzzle Type*/ export type Puzzle = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  name: { Type: Scalars["string"]; Args: undefined };
  code: { Type: Scalars["string"]; Args: undefined };
  is_public: { Type: Scalars["boolean"]; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**Algorithm Set*/ export type Algset = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  name: { Type: Scalars["string"]; Args: undefined };
  code: { Type: Scalars["string"]; Args: undefined };
  parent: { Type: Algset | null; Args: undefined };
  puzzle: { Type: Puzzle; Args: undefined };
  mask: { Type: Scalars["string"] | null; Args: undefined };
  visualization: { Type: Scalars["caseVisualization"]; Args: undefined };
  score: { Type: Scalars["number"]; Args: undefined };
  is_public: { Type: Scalars["boolean"]; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**Algorithm Case*/ export type Algcase = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  name: { Type: Scalars["string"]; Args: undefined };
  algset: { Type: Algset; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**Algorithm*/ export type Alg = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  sequence: { Type: Scalars["string"]; Args: undefined };
  is_approved: { Type: Scalars["boolean"]; Args: undefined };
  score: { Type: Scalars["number"]; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**Tag type*/ export type Tag = {
  /**The unique ID of the field*/ id: { Type: Scalars["id"]; Args: undefined };
  /**The typename of the record*/ __typename: {
    Type: Scalars["string"];
    Args: [Scalars["number"]];
  };
  name: { Type: Scalars["string"]; Args: undefined };
  /**When the record was created*/ created_at: {
    Type: Scalars["unixTimestamp"];
    Args: undefined;
  };
  /**When the record was last updated*/ updated_at: {
    Type: Scalars["unixTimestamp"] | null;
    Args: undefined;
  };
  created_by: { Type: User; Args: undefined };
};
/**All Root resolvers*/ export type Root = {
  getUserRoleEnumPaginator: { Type: UserRoleEnumPaginator; Args: undefined };
  getFilterOperatorEnumPaginator: {
    Type: FilterOperatorEnumPaginator;
    Args: undefined;
  };
  getCaseVisualizationEnumPaginator: {
    Type: CaseVisualizationEnumPaginator;
    Args: undefined;
  };
  getCurrentUser: { Type: User; Args: undefined };
  getUser: { Type: User; Args: InputType["getUser"] };
  getUserPaginator: {
    Type: UserPaginator;
    Args: InputType["getUserPaginator"];
  };
  deleteUser: { Type: User; Args: InputType["getUser"] };
  createUser: { Type: User; Args: InputType["createUser"] };
  updateUser: { Type: User; Args: InputType["updateUser"] };
  socialLogin: { Type: Auth; Args: [InputType["socialLogin"]] };
  getPuzzle: { Type: Puzzle; Args: InputType["getPuzzle"] };
  getPuzzlePaginator: {
    Type: PuzzlePaginator;
    Args: InputType["getPuzzlePaginator"];
  };
  deletePuzzle: { Type: Puzzle; Args: InputType["getPuzzle"] };
  createPuzzle: { Type: Puzzle; Args: InputType["createPuzzle"] };
  updatePuzzle: { Type: Puzzle; Args: InputType["updatePuzzle"] };
  getAlgset: { Type: Algset; Args: InputType["getAlgset"] };
  getAlgsetPaginator: {
    Type: AlgsetPaginator;
    Args: InputType["getAlgsetPaginator"];
  };
  deleteAlgset: { Type: Algset; Args: InputType["getAlgset"] };
  createAlgset: { Type: Algset; Args: InputType["createAlgset"] };
  updateAlgset: { Type: Algset; Args: InputType["updateAlgset"] };
  getAlgcase: { Type: Algcase; Args: InputType["getAlgcase"] };
  getAlgcasePaginator: {
    Type: AlgcasePaginator;
    Args: InputType["getAlgcasePaginator"];
  };
  deleteAlgcase: { Type: Algcase; Args: InputType["getAlgcase"] };
  createAlgcase: { Type: Algcase; Args: InputType["createAlgcase"] };
  updateAlgcase: { Type: Algcase; Args: InputType["updateAlgcase"] };
  getAlg: { Type: Alg; Args: InputType["getAlg"] };
  getAlgPaginator: { Type: AlgPaginator; Args: InputType["getAlgPaginator"] };
  deleteAlg: { Type: Alg; Args: InputType["getAlg"] };
  createAlg: { Type: Alg; Args: InputType["createAlg"] };
  updateAlg: { Type: Alg; Args: InputType["updateAlg"] };
  getTag: { Type: Tag; Args: InputType["getTag"] };
  getTagPaginator: { Type: TagPaginator; Args: InputType["getTagPaginator"] };
  deleteTag: { Type: Tag; Args: InputType["getTag"] };
  createTag: { Type: Tag; Args: InputType["createTag"] };
  deleteAlgAlgcaseLink: {
    Type: AlgAlgcaseLink;
    Args: InputType["getAlgAlgcaseLink"];
  };
  createAlgAlgcaseLink: {
    Type: AlgAlgcaseLink;
    Args: InputType["createAlgAlgcaseLink"];
  };
  deleteAlgTagLink: { Type: AlgTagLink; Args: InputType["getAlgTagLink"] };
  createAlgTagLink: { Type: AlgTagLink; Args: InputType["createAlgTagLink"] };
};
