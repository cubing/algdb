// Query builder
const queryResult = executeJomql({
  // Start typing here to get hints
});

export function executeJomql<Key extends keyof Root>(
  query: GetQuery<Key>
): GetResponse<Key> {
  let data: any;
  return data;
}

// scaffolding
export type GetQuery<K extends keyof Root> = Record<
  K,
  Argize<Queryize<Root[K]["Type"]>, Root[K]["Args"]>
>;

export type GetResponse<K extends keyof Root> = Omit<Root[K]["Type"], args>;

type Primitive = string | number | boolean | undefined | null;

type args = "__args";

type ElementType<T extends any[]> = T[number];

type Queryize<T> = T extends never
  ? never
  : T extends Primitive
  ? true
  : T extends any[]
  ? Queryize<ElementType<T>>
  : args extends keyof T
  ? {
      [P in keyof T as Exclude<P, args>]?: Queryize<T[P]>;
    } &
      (undefined extends T[args] ? { __args?: T[args] } : { __args: T[args] })
  : {
      [P in keyof T]?: Queryize<T[P]>;
    };

type Argize<T, Args> = Args extends undefined
  ? Omit<T, args>
  : Omit<T, args> & { __args: Args };

type Edge<T> = {
  __typename: string;
  node: Omit<T, args>;
  cursor: string;
};

type FilterByObject<T> = {
  field: T;
  operator?: string;
  value: unknown;
};

/**All scalar values*/ export type Scalars = {
  /**String value*/ string: string;
  /**Numerical value*/ number: number;
  /**True or False*/ boolean: boolean;
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
/**All input types*/ export type InputType = {
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
  userFilterByObject: {
    id?: InputType["userFilterByField/id"][];
    created_by?: InputType["userFilterByField/created_by"][];
    "created_by.name"?: InputType["userFilterByField/created_by.name"][];
    role?: InputType["userFilterByField/role"][];
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
  deleteUser: { id?: Scalars["id"] };
  createUser: {
    provider: Scalars["string"];
    provider_id: Scalars["string"];
    wca_id?: Scalars["string"];
    email: Scalars["string"];
    name: Scalars["string"];
    avatar?: Scalars["string"];
    country?: Scalars["string"];
    is_public?: Scalars["boolean"];
    role?: Scalars["userRole"];
    permissions?: Scalars["userPermission"][];
  };
  updateUserFields: {
    email?: Scalars["string"];
    name?: Scalars["string"];
    avatar?: Scalars["string"];
    country?: Scalars["string"];
    is_public?: Scalars["boolean"];
    role?: Scalars["userRole"];
    permissions?: Scalars["userPermission"][];
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
  deletePuzzle: { id?: Scalars["id"]; code?: Scalars["string"] };
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
  algsetFilterByObject: {
    id?: InputType["algsetFilterByField/id"][];
    created_by?: InputType["algsetFilterByField/created_by"][];
    code?: InputType["algsetFilterByField/code"][];
    is_public?: InputType["algsetFilterByField/is_public"][];
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
  deleteAlgset: { id?: Scalars["id"]; code?: Scalars["string"] };
  createAlgset: {
    name: Scalars["string"];
    code: Scalars["string"];
    parent?: InputType["getAlgset"];
    puzzle: InputType["getPuzzle"];
    mask?: Scalars["string"];
    visualization?: Scalars["caseVisualization"];
    score?: Scalars["number"];
    is_public?: Scalars["boolean"];
  };
  updateAlgsetFields: {
    name?: Scalars["string"];
    code?: Scalars["string"];
    parent?: InputType["getAlgset"];
    puzzle?: InputType["getPuzzle"];
    mask?: Scalars["string"];
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
  algcaseFilterByObject: {
    id?: InputType["algcaseFilterByField/id"][];
    created_by?: InputType["algcaseFilterByField/created_by"][];
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
  deleteAlgcase: { id?: Scalars["id"] };
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
  deleteAlg: { id?: Scalars["id"] };
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
  tagFilterByObject: {
    id?: InputType["tagFilterByField/id"][];
    alg?: InputType["tagFilterByField/alg"][];
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
  deleteTag: { id?: Scalars["id"] };
  createTag: { name: Scalars["string"] };
  deleteAlgAlgcaseLink: { id?: Scalars["id"] };
  createAlgAlgcaseLink: {
    alg: InputType["getAlg"];
    algcase: InputType["getAlgcase"];
  };
  deleteAlgTagLink: { id?: Scalars["id"] };
  createAlgTagLink: { alg: InputType["getAlg"]; tag: InputType["getTag"] };
};
/**PaginatorInfo Type*/ export type PaginatorInfo = {
  /**The typename of the record*/ __typename: Scalars["string"];
  total: Scalars["number"];
  count: Scalars["number"];
  startCursor: Scalars["string"] | null;
  endCursor: Scalars["string"] | null;
};
export type UserEdge = Edge<User>;
/**Paginator*/ export type UserPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  paginatorInfo: PaginatorInfo;
  edges: UserEdge[];
  /**Args for UserPaginator*/ __args: Root["getUserPaginator"]["Args"];
};
export type PuzzleEdge = Edge<Puzzle>;
/**Paginator*/ export type PuzzlePaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  paginatorInfo: PaginatorInfo;
  edges: PuzzleEdge[];
  /**Args for PuzzlePaginator*/ __args: Root["getPuzzlePaginator"]["Args"];
};
export type AlgsetEdge = Edge<Algset>;
/**Paginator*/ export type AlgsetPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  paginatorInfo: PaginatorInfo;
  edges: AlgsetEdge[];
  /**Args for AlgsetPaginator*/ __args: Root["getAlgsetPaginator"]["Args"];
};
export type AlgcaseEdge = Edge<Algcase>;
/**Paginator*/ export type AlgcasePaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  paginatorInfo: PaginatorInfo;
  edges: AlgcaseEdge[];
  /**Args for AlgcasePaginator*/ __args: Root["getAlgcasePaginator"]["Args"];
};
export type AlgEdge = Edge<Alg>;
/**Paginator*/ export type AlgPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  paginatorInfo: PaginatorInfo;
  edges: AlgEdge[];
  /**Args for AlgPaginator*/ __args: Root["getAlgPaginator"]["Args"];
};
export type TagEdge = Edge<Tag>;
/**Paginator*/ export type TagPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  paginatorInfo: PaginatorInfo;
  edges: TagEdge[];
  /**Args for TagPaginator*/ __args: Root["getTagPaginator"]["Args"];
};
/**Link type*/ export type AlgAlgcaseLink = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  alg: Alg;
  algcase: Algcase;
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
};
/**Link type*/ export type AlgTagLink = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  alg: Alg;
  tag: Tag;
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
};
/**EnumPaginator*/ export type UserRoleEnumPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  values: Scalars["userRole"][];
};
/**EnumPaginator*/ export type FilterOperatorEnumPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  values: Scalars["filterOperator"][];
};
/**EnumPaginator*/ export type CaseVisualizationEnumPaginator = {
  /**The typename of the record*/ __typename: Scalars["string"];
  values: Scalars["caseVisualization"][];
};
/**User type*/ export type User = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  provider: never;
  provider_id: never;
  wca_id: Scalars["string"] | null;
  email: Scalars["string"];
  name: Scalars["string"];
  avatar: Scalars["string"] | null;
  country: Scalars["string"] | null;
  is_public: Scalars["boolean"];
  role: Scalars["userRole"];
  permissions: (Scalars["userPermission"] | null)[];
  all_permissions: Scalars["userPermission"][];
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
  /**Args for User*/ __args: Root["getUser"]["Args"];
};
/**Authentication type*/ export type Auth = {
  /**The typename of the record*/ __typename: Scalars["string"];
  type: Scalars["string"];
  token: Scalars["string"];
  expiration: Scalars["number"];
  expiration_days: Scalars["number"];
  user: User;
};
/**Puzzle Type*/ export type Puzzle = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  name: Scalars["string"];
  code: Scalars["string"];
  is_public: Scalars["boolean"];
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
  /**Args for Puzzle*/ __args: Root["getPuzzle"]["Args"];
};
/**Algorithm Set*/ export type Algset = {
  /**The unique ID of the field*/ id: Scalars["id"];
  name: Scalars["string"];
  code: Scalars["string"];
  parent: Algset | null;
  puzzle: Puzzle;
  mask: Scalars["string"] | null;
  visualization: Scalars["caseVisualization"];
  score: Scalars["number"];
  is_public: Scalars["boolean"];
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
  /**Args for Algset*/ __args: Root["getAlgset"]["Args"];
};
/**Algorithm Case*/ export type Algcase = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  name: Scalars["string"];
  algset: Algset;
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
  /**Args for Algcase*/ __args: Root["getAlgcase"]["Args"];
};
/**Algorithm*/ export type Alg = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  sequence: Scalars["string"];
  is_approved: Scalars["boolean"];
  score: Scalars["number"];
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
  /**Args for Alg*/ __args: Root["getAlg"]["Args"];
};
/**Tag type*/ export type Tag = {
  /**The unique ID of the field*/ id: Scalars["id"];
  /**The typename of the record*/ __typename: Scalars["string"];
  name: Scalars["string"];
  /**When the record was created*/ created_at: Scalars["unixTimestamp"];
  /**When the record was last updated*/ updated_at:
    | Scalars["unixTimestamp"]
    | null;
  created_by: User;
  /**Args for Tag*/ __args: Root["getTag"]["Args"];
};
/**Root type*/ export type Root = {
  getCurrentUser: { Type: User; Args?: undefined };
  getUser: { Type: User; Args: InputType["getUser"] };
  getUserPaginator: {
    Type: UserPaginator;
    Args: InputType["getUserPaginator"];
  };
  deleteUser: { Type: User; Args: InputType["deleteUser"] };
  createUser: { Type: User; Args: InputType["createUser"] };
  updateUser: { Type: User; Args: InputType["updateUser"] };
  socialLogin: { Type: Auth; Args?: InputType["socialLogin"] };
  getPuzzle: { Type: Puzzle; Args: InputType["getPuzzle"] };
  getPuzzlePaginator: {
    Type: PuzzlePaginator;
    Args: InputType["getPuzzlePaginator"];
  };
  deletePuzzle: { Type: Puzzle; Args: InputType["deletePuzzle"] };
  createPuzzle: { Type: Puzzle; Args: InputType["createPuzzle"] };
  updatePuzzle: { Type: Puzzle; Args: InputType["updatePuzzle"] };
  getAlgset: { Type: Algset; Args: InputType["getAlgset"] };
  getAlgsetPaginator: {
    Type: AlgsetPaginator;
    Args: InputType["getAlgsetPaginator"];
  };
  deleteAlgset: { Type: Algset; Args: InputType["deleteAlgset"] };
  createAlgset: { Type: Algset; Args: InputType["createAlgset"] };
  updateAlgset: { Type: Algset; Args: InputType["updateAlgset"] };
  getAlgcase: { Type: Algcase; Args: InputType["getAlgcase"] };
  getAlgcasePaginator: {
    Type: AlgcasePaginator;
    Args: InputType["getAlgcasePaginator"];
  };
  deleteAlgcase: { Type: Algcase; Args: InputType["deleteAlgcase"] };
  createAlgcase: { Type: Algcase; Args: InputType["createAlgcase"] };
  updateAlgcase: { Type: Algcase; Args: InputType["updateAlgcase"] };
  getAlg: { Type: Alg; Args: InputType["getAlg"] };
  getAlgPaginator: { Type: AlgPaginator; Args: InputType["getAlgPaginator"] };
  deleteAlg: { Type: Alg; Args: InputType["deleteAlg"] };
  createAlg: { Type: Alg; Args: InputType["createAlg"] };
  updateAlg: { Type: Alg; Args: InputType["updateAlg"] };
  getTag: { Type: Tag; Args: InputType["getTag"] };
  getTagPaginator: { Type: TagPaginator; Args: InputType["getTagPaginator"] };
  deleteTag: { Type: Tag; Args: InputType["deleteTag"] };
  createTag: { Type: Tag; Args: InputType["createTag"] };
  deleteAlgAlgcaseLink: {
    Type: AlgAlgcaseLink;
    Args: InputType["deleteAlgAlgcaseLink"];
  };
  createAlgAlgcaseLink: {
    Type: AlgAlgcaseLink;
    Args: InputType["createAlgAlgcaseLink"];
  };
  deleteAlgTagLink: { Type: AlgTagLink; Args: InputType["deleteAlgTagLink"] };
  createAlgTagLink: { Type: AlgTagLink; Args: InputType["createAlgTagLink"] };
  getUserRoleEnumPaginator: { Type: UserRoleEnumPaginator; Args?: undefined };
  getFilterOperatorEnumPaginator: {
    Type: FilterOperatorEnumPaginator;
    Args?: undefined;
  };
  getCaseVisualizationEnumPaginator: {
    Type: CaseVisualizationEnumPaginator;
    Args?: undefined;
  };
};
