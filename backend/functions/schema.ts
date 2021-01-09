// scaffolding
export type GetQuery<K extends keyof Root> = Record<
  K,
  Argize<Queryize<Root[K]["Query"]>, Root[K]["Args"]>
>;

export type GetResponse<K extends keyof Root> = Omit<Root[K]["Response"], args>;

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
  ? Omit<
      {
        [P in keyof T]?: Queryize<T[P]>;
      },
      args
    > &
      (undefined extends T[args] ? { __args?: T[args] } : { __args: T[args] })
  : {
      [P in keyof T]?: Queryize<T[P]>;
    };

type Argize<T, Args> = Args extends undefined
  ? Omit<T, args>
  : Omit<T, args> & { __args: Args };

type Edge<T> = {
  node: Omit<T, args>;
  cursor: string;
};

type FilterByObject<T> = {
  field: T;
  operator?: string;
  value: unknown;
};

export type Scalars = {
  string: string;
  boolean: boolean;
  number: number;
  unknown: unknown;
  imageUrl: string;
  unixTimestamp: number;
  jsonAsString: string;
  id: number;
  userRole: "NONE" | "NORMAL" | "ADMIN";
  filterOperator: "eq" | "neq" | "gt" | "lt" | "in" | "nin" | "regex" | "like";
  caseVisualization: "V_2D" | "V_3D" | "V_PG3D";
  userSortBy: "id" | "created_at" | "updated_at";
  userFilterByFields: "id" | "created_by" | "created_by.name" | "role";
  userGroupBy: undefined;
  puzzleSortBy: "id" | "created_at";
  puzzleFilterByFields: "id" | "created_by" | "code" | "is_public";
  puzzleGroupBy: undefined;
  algsetSortBy: "id" | "created_at";
  algsetFilterByFields: "id" | "created_by" | "code" | "is_public";
  algsetGroupBy: undefined;
  algcaseSortBy: "id" | "created_at";
  algcaseFilterByFields: "id" | "created_by" | "code" | "is_public";
  algcaseGroupBy: undefined;
  algSortBy: "id" | "created_at";
  algFilterByFields: "id" | "algcase.name" | "algcase";
  algGroupBy: "id";
};
export type InputType = {
  getUser: { id?: Scalars["id"] };
  userFilterByObject: FilterByObject<Scalars["userFilterByFields"]>;
  getUserPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["userSortBy"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["userFilterByObject"][];
    groupBy?: Scalars["userGroupBy"][];
    search?: Scalars["string"];
  };
  getPuzzle: { id?: Scalars["id"]; code?: Scalars["string"] };
  puzzleFilterByObject: FilterByObject<Scalars["puzzleFilterByFields"]>;
  getPuzzlePaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["puzzleSortBy"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["puzzleFilterByObject"][];
    groupBy?: Scalars["puzzleGroupBy"][];
    search?: Scalars["string"];
  };
  getAlgset: { id?: Scalars["id"]; code?: Scalars["string"] };
  algsetFilterByObject: FilterByObject<Scalars["algsetFilterByFields"]>;
  getAlgsetPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["algsetSortBy"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["algsetFilterByObject"][];
    groupBy?: Scalars["algsetGroupBy"][];
    search?: Scalars["string"];
  };
  getAlgcase: { id?: Scalars["id"] };
  algcaseFilterByObject: FilterByObject<Scalars["algcaseFilterByFields"]>;
  getAlgcasePaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["algcaseSortBy"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["algcaseFilterByObject"][];
    groupBy?: Scalars["algcaseGroupBy"][];
    search?: Scalars["string"];
  };
  getAlg: { id?: Scalars["id"] };
  algFilterByObject: FilterByObject<Scalars["algFilterByFields"]>;
  getAlgPaginator: {
    first?: Scalars["number"];
    last?: Scalars["number"];
    after?: Scalars["string"];
    before?: Scalars["string"];
    sortBy?: Scalars["algSortBy"][];
    sortDesc?: Scalars["boolean"][];
    filterBy?: InputType["algFilterByObject"][];
    groupBy?: Scalars["algGroupBy"][];
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
    role?: Scalars["userRole"];
  };
  updateUserFields: {
    email?: Scalars["string"];
    name?: Scalars["string"];
    avatar?: Scalars["string"];
    role?: Scalars["userRole"];
  };
  updateUser: {
    item?: InputType["getUser"];
    fields?: InputType["updateUserFields"];
  };
  socialLogin: {
    provider: Scalars["string"];
    code: Scalars["string"];
    redirect_uri: Scalars["string"];
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
    item?: InputType["getPuzzle"];
    fields?: InputType["updatePuzzleFields"];
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
    item?: InputType["getAlgset"];
    fields?: InputType["updateAlgsetFields"];
  };
  deleteAlgcase: { id?: Scalars["id"] };
  createAlgcase: { name: Scalars["string"]; algset: InputType["getAlgset"] };
  updateAlgcaseFields: {
    name?: Scalars["string"];
    algset?: InputType["getAlgset"];
  };
  updateAlgcase: {
    item?: InputType["getAlgcase"];
    fields?: InputType["updateAlgcaseFields"];
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
    item?: InputType["getAlg"];
    fields?: InputType["updateAlgFields"];
  };
  deleteAlgAlgcaseLink: { id?: Scalars["id"] };
  createAlgAlgcaseLink: {
    alg: InputType["getAlg"];
    algcase: InputType["getAlgcase"];
  };
};
export type PaginatorInfo = {
  total: Scalars["number"];
  count: Scalars["number"];
  startCursor: Scalars["string"] | null;
  endCursor: Scalars["string"] | null;
};
export type UserEdge = Edge<User>;
export type PuzzleEdge = Edge<Puzzle>;
export type AlgsetEdge = Edge<Algset>;
export type AlgcaseEdge = Edge<Algcase>;
export type AlgEdge = Edge<Alg>;
export type User = {
  id: Scalars["id"];
  provider: never;
  provider_id: never;
  wca_id: Scalars["string"] | null;
  email: Scalars["string"];
  name: Scalars["string"];
  avatar: Scalars["string"] | null;
  role: Scalars["userRole"];
  created_at: Scalars["unixTimestamp"];
  updated_at: Scalars["unixTimestamp"] | null;
  created_by: User;
  __args: Root["getUser"]["Args"];
};
export type UserPaginator = {
  paginatorInfo: PaginatorInfo;
  edges: UserEdge[];
  __args: Root["getUserPaginator"]["Args"];
};
export type Puzzle = {
  id: Scalars["id"];
  name: Scalars["string"];
  code: Scalars["string"];
  is_public: Scalars["boolean"];
  created_at: Scalars["unixTimestamp"];
  updated_at: Scalars["unixTimestamp"] | null;
  created_by: User;
  __args: Root["getPuzzle"]["Args"];
};
export type PuzzlePaginator = {
  paginatorInfo: PaginatorInfo;
  edges: PuzzleEdge[];
  __args: Root["getPuzzlePaginator"]["Args"];
};
export type Algset = {
  id: Scalars["id"];
  name: Scalars["string"];
  code: Scalars["string"];
  parent: Algset | null;
  puzzle: Puzzle;
  mask: Scalars["string"] | null;
  visualization: Scalars["caseVisualization"];
  score: Scalars["number"];
  is_public: Scalars["boolean"];
  created_at: Scalars["unixTimestamp"];
  updated_at: Scalars["unixTimestamp"] | null;
  created_by: User;
  __args: Root["getAlgset"]["Args"];
};
export type AlgsetPaginator = {
  paginatorInfo: PaginatorInfo;
  edges: AlgsetEdge[];
  __args: Root["getAlgsetPaginator"]["Args"];
};
export type Algcase = {
  id: Scalars["id"];
  name: Scalars["string"];
  algset: Algset;
  created_at: Scalars["unixTimestamp"];
  updated_at: Scalars["unixTimestamp"] | null;
  created_by: User;
  __args: Root["getAlgcase"]["Args"];
};
export type AlgcasePaginator = {
  paginatorInfo: PaginatorInfo;
  edges: AlgcaseEdge[];
  __args: Root["getAlgcasePaginator"]["Args"];
};
export type AlgAlgcaseLink = {
  id: Scalars["id"];
  alg: Alg;
  algcase: Algcase;
  created_at: Scalars["unixTimestamp"];
  updated_at: Scalars["unixTimestamp"] | null;
  created_by: User;
};
export type Alg = {
  id: Scalars["id"];
  sequence: Scalars["string"];
  is_approved: Scalars["boolean"];
  score: Scalars["number"];
  created_at: Scalars["unixTimestamp"];
  updated_at: Scalars["unixTimestamp"] | null;
  created_by: User;
  __args: Root["getAlg"]["Args"];
};
export type AlgPaginator = {
  paginatorInfo: PaginatorInfo;
  edges: AlgEdge[];
  __args: Root["getAlgPaginator"]["Args"];
};
export type Auth = {
  type: Scalars["string"];
  token: Scalars["string"];
  expiration: Scalars["number"];
  expiration_days: Scalars["number"];
  user: User;
};
export type Root = {
  getCurrentUser: { Query: User; Response: User; Args?: undefined };
  getUser: { Query: User; Response: User; Args: InputType["getUser"] };
  getUserPaginator: {
    Query: UserPaginator;
    Response: UserPaginator;
    Args: InputType["getUserPaginator"];
  };
  getPuzzle: { Query: Puzzle; Response: Puzzle; Args: InputType["getPuzzle"] };
  getPuzzlePaginator: {
    Query: PuzzlePaginator;
    Response: PuzzlePaginator;
    Args: InputType["getPuzzlePaginator"];
  };
  getAlgset: { Query: Algset; Response: Algset; Args: InputType["getAlgset"] };
  getAlgsetPaginator: {
    Query: AlgsetPaginator;
    Response: AlgsetPaginator;
    Args: InputType["getAlgsetPaginator"];
  };
  getAlgcase: {
    Query: Algcase;
    Response: Algcase;
    Args: InputType["getAlgcase"];
  };
  getAlgcasePaginator: {
    Query: AlgcasePaginator;
    Response: AlgcasePaginator;
    Args: InputType["getAlgcasePaginator"];
  };
  getAlg: { Query: Alg; Response: Alg; Args: InputType["getAlg"] };
  getAlgPaginator: {
    Query: AlgPaginator;
    Response: AlgPaginator;
    Args: InputType["getAlgPaginator"];
  };
  getAllUserRole: {
    Query: Scalars["userRole"];
    Response: Scalars["userRole"];
    Args?: undefined;
  };
  getAllFilterOperator: {
    Query: Scalars["filterOperator"];
    Response: Scalars["filterOperator"];
    Args?: undefined;
  };
  getAllCaseVisualization: {
    Query: Scalars["caseVisualization"];
    Response: Scalars["caseVisualization"];
    Args?: undefined;
  };
  deleteUser: { Query: User; Response: User; Args: InputType["deleteUser"] };
  createUser: { Query: User; Response: User; Args: InputType["createUser"] };
  updateUser: { Query: User; Response: User; Args: InputType["updateUser"] };
  socialLogin: { Query: Auth; Response: Auth; Args?: InputType["socialLogin"] };
  deletePuzzle: {
    Query: Puzzle;
    Response: Puzzle;
    Args: InputType["deletePuzzle"];
  };
  createPuzzle: {
    Query: Puzzle;
    Response: Puzzle;
    Args: InputType["createPuzzle"];
  };
  updatePuzzle: {
    Query: Puzzle;
    Response: Puzzle;
    Args: InputType["updatePuzzle"];
  };
  deleteAlgset: {
    Query: Algset;
    Response: Algset;
    Args: InputType["deleteAlgset"];
  };
  createAlgset: {
    Query: Algset;
    Response: Algset;
    Args: InputType["createAlgset"];
  };
  updateAlgset: {
    Query: Algset;
    Response: Algset;
    Args: InputType["updateAlgset"];
  };
  deleteAlgcase: {
    Query: Algcase;
    Response: Algcase;
    Args: InputType["deleteAlgcase"];
  };
  createAlgcase: {
    Query: Algcase;
    Response: Algcase;
    Args: InputType["createAlgcase"];
  };
  updateAlgcase: {
    Query: Algcase;
    Response: Algcase;
    Args: InputType["updateAlgcase"];
  };
  deleteAlg: { Query: Alg; Response: Alg; Args: InputType["deleteAlg"] };
  createAlg: { Query: Alg; Response: Alg; Args: InputType["createAlg"] };
  updateAlg: { Query: Alg; Response: Alg; Args: InputType["updateAlg"] };
  deleteAlgAlgcaseLink: {
    Query: AlgAlgcaseLink;
    Response: AlgAlgcaseLink;
    Args: InputType["deleteAlgAlgcaseLink"];
  };
  createAlgAlgcaseLink: {
    Query: AlgAlgcaseLink;
    Response: AlgAlgcaseLink;
    Args: InputType["createAlgAlgcaseLink"];
  };
};
