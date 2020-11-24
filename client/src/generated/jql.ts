export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  getCurrentUser?: Maybe<User>;
  getUser: User;
  getMultipleUser: UserPaginator;
  getPuzzle: Puzzle;
  getMultiplePuzzle: PuzzlePaginator;
  getAlgset: Algset;
  getMultipleAlgset: AlgsetPaginator;
  getAlgcase: Algcase;
  getMultipleAlgcase: AlgcasePaginator;
  getAlg: Alg;
  getMultipleAlg: AlgPaginator;
  getTag: Tag;
  getMultipleTag: TagPaginator;
};


export type QueryGetUserArgs = {
  id: Scalars['ID'];
};


export type QueryGetMultipleUserArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  filterBy?: Maybe<UserFilterInput>;
};


export type QueryGetPuzzleArgs = {
  id?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
};


export type QueryGetMultiplePuzzleArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  filterBy?: Maybe<PuzzleFilterInput>;
};


export type QueryGetAlgsetArgs = {
  id?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  puzzle_code?: Maybe<Scalars['String']>;
};


export type QueryGetMultipleAlgsetArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  filterBy?: Maybe<AlgsetFilterInput>;
};


export type QueryGetAlgcaseArgs = {
  id: Scalars['ID'];
};


export type QueryGetMultipleAlgcaseArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  filterBy?: Maybe<AlgcaseFilterInput>;
};


export type QueryGetAlgArgs = {
  id: Scalars['ID'];
};


export type QueryGetMultipleAlgArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  groupBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  filterBy?: Maybe<AlgFilterInput>;
};


export type QueryGetTagArgs = {
  id: Scalars['ID'];
};


export type QueryGetMultipleTagArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  filterBy?: Maybe<TagFilterInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  deleteUser: User;
  updateUser: User;
  loginUser: Auth;
  socialLogin: Auth;
  deletePuzzle: Puzzle;
  updatePuzzle: Puzzle;
  createPuzzle: Puzzle;
  deleteAlgset: Algset;
  updateAlgset: Algset;
  createAlgset: Algset;
  deleteAlgcase: Algcase;
  updateAlgcase: Algcase;
  createAlgcase: Algcase;
  deleteAlg: Alg;
  updateAlg: Alg;
  createAlg: Alg;
  deleteAlgAlgcaseLink: AlgAlgcaseLink;
  updateAlgAlgcaseLink: AlgAlgcaseLink;
  createAlgAlgcaseLink: AlgAlgcaseLink;
  deleteUserAlgTagLink: UserAlgTagLink;
  updateUserAlgTagLink: UserAlgTagLink;
  createUserAlgTagLink: UserAlgTagLink;
  deleteAlgTagLink: AlgTagLink;
  createAlgTagLink: AlgTagLink;
  deleteTag: Tag;
  createTag: Tag;
  upsertUserAlgVoteLink: UserAlgVoteLink;
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  is_public?: Maybe<Scalars['Boolean']>;
  role?: Maybe<UserRole>;
};


export type MutationLoginUserArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSocialLoginArgs = {
  provider: Scalars['String'];
  code: Scalars['String'];
};


export type MutationDeletePuzzleArgs = {
  id: Scalars['ID'];
};


export type MutationUpdatePuzzleArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  is_public?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
};


export type MutationCreatePuzzleArgs = {
  name: Scalars['String'];
  code: Scalars['String'];
};


export type MutationDeleteAlgsetArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAlgsetArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  is_public?: Maybe<Scalars['Boolean']>;
  mask?: Maybe<Scalars['String']>;
  visualization?: Maybe<CaseVisualization>;
};


export type MutationCreateAlgsetArgs = {
  name?: Maybe<Scalars['String']>;
  mask?: Maybe<Scalars['String']>;
  visualization?: Maybe<CaseVisualization>;
  puzzle?: Maybe<Puzzle>;
  score?: Maybe<Scalars['Int']>;
};


export type MutationDeleteAlgcaseArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAlgcaseArgs = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};


export type MutationCreateAlgcaseArgs = {
  name?: Maybe<Scalars['String']>;
  mask?: Maybe<Scalars['String']>;
  puzzle?: Maybe<Puzzle>;
  algset?: Maybe<Algset>;
};


export type MutationDeleteAlgArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAlgArgs = {
  id: Scalars['ID'];
};


export type MutationCreateAlgArgs = {
  sequence?: Maybe<Scalars['String']>;
};


export type MutationDeleteAlgAlgcaseLinkArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAlgAlgcaseLinkArgs = {
  id: Scalars['ID'];
};


export type MutationCreateAlgAlgcaseLinkArgs = {
  alg?: Maybe<Alg>;
  algcase?: Maybe<Algcase>;
};


export type MutationDeleteUserAlgTagLinkArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateUserAlgTagLinkArgs = {
  id: Scalars['ID'];
};


export type MutationCreateUserAlgTagLinkArgs = {
  user?: Maybe<User>;
  alg?: Maybe<Alg>;
  tag?: Maybe<Tag>;
};


export type MutationDeleteAlgTagLinkArgs = {
  id: Scalars['ID'];
};


export type MutationCreateAlgTagLinkArgs = {
  alg?: Maybe<Alg>;
  tag?: Maybe<Tag>;
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID'];
};


export type MutationCreateTagArgs = {
  name?: Maybe<Scalars['String']>;
};


export type MutationUpsertUserAlgVoteLinkArgs = {
  alg: Scalars['ID'];
  vote_value: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  wca_id?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  is_public: Scalars['Boolean'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  role: UserRoleEnum;
};

export type UserPaginator = {
  __typename?: 'UserPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<User>>;
};

export type UserFilterInput = {
  __typename?: 'UserFilterInput';
  search?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
};

export type Puzzle = {
  __typename?: 'Puzzle';
  id: Scalars['ID'];
  name: Scalars['String'];
  code: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  is_public: Scalars['Boolean'];
  algsets: AlgsetPaginator;
};


export type PuzzleAlgsetsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  filterBy?: Maybe<Algset>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
};

export type PuzzlePaginator = {
  __typename?: 'PuzzlePaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<Puzzle>>;
};

export type PuzzleFilterInput = {
  __typename?: 'PuzzleFilterInput';
  id?: Maybe<Scalars['ID']>;
  search?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
  is_public?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
};

export type Algset = {
  __typename?: 'Algset';
  id: Scalars['ID'];
  name: Scalars['String'];
  code: Scalars['String'];
  mask?: Maybe<Scalars['String']>;
  visualization: CaseVisualization;
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  is_public: Scalars['Boolean'];
  puzzle: Puzzle;
  parent?: Maybe<Algset>;
  algcases: AlgcasePaginator;
  score: Scalars['Int'];
};


export type AlgsetAlgcasesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  filterBy?: Maybe<AlgcaseFilterInput>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
};

export type AlgsetPaginator = {
  __typename?: 'AlgsetPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<Algset>>;
};

export type AlgsetFilterInput = {
  __typename?: 'AlgsetFilterInput';
  id?: Maybe<Scalars['ID']>;
  search?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['String']>;
  puzzle?: Maybe<Scalars['String']>;
  puzzle_code?: Maybe<Scalars['String']>;
  is_public?: Maybe<Scalars['Boolean']>;
  code?: Maybe<Scalars['String']>;
};

export type Algcase = {
  __typename?: 'Algcase';
  id: Scalars['ID'];
  name: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  algset: Algset;
  algs: AlgPaginator;
};


export type AlgcaseAlgsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['ID']>;
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>;
  created_by?: Maybe<Scalars['String']>;
  algcase_name?: Maybe<Scalars['String']>;
  algset_name?: Maybe<Scalars['String']>;
  puzzle_name?: Maybe<Scalars['String']>;
  tag_name?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AlgcasePaginator = {
  __typename?: 'AlgcasePaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<Algcase>>;
};

export type AlgcaseFilterInput = {
  __typename?: 'AlgcaseFilterInput';
  id?: Maybe<Scalars['ID']>;
  search?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
  algset?: Maybe<Scalars['String']>;
};

export type Alg = {
  __typename?: 'Alg';
  id: Scalars['ID'];
  sequence: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  score: Scalars['Int'];
  current_user_vote?: Maybe<UserAlgVoteLink>;
};

export type AlgPaginator = {
  __typename?: 'AlgPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<Alg>>;
};

export type AlgFilterInput = {
  __typename?: 'AlgFilterInput';
  id?: Maybe<Scalars['ID']>;
  search?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
  algcase_name?: Maybe<Scalars['String']>;
  algcase?: Maybe<Scalars['ID']>;
  algset_name?: Maybe<Scalars['String']>;
  puzzle_name?: Maybe<Scalars['String']>;
  tag_name?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AlgAlgcaseLink = {
  __typename?: 'AlgAlgcaseLink';
  id: Scalars['ID'];
  alg: Alg;
  algcase: Algcase;
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type AlgAlgcaseLinkPaginator = {
  __typename?: 'AlgAlgcaseLinkPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<AlgAlgcaseLink>>;
};

export type AlgTagLink = {
  __typename?: 'AlgTagLink';
  id: Scalars['ID'];
  alg: Alg;
  tag: Tag;
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type AlgTagLinkPaginator = {
  __typename?: 'AlgTagLinkPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<AlgTagLink>>;
};

export type UserAlgTagLink = {
  __typename?: 'UserAlgTagLink';
  id: Scalars['ID'];
  user: User;
  alg: Alg;
  tag: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type UserAlgTagLinkPaginator = {
  __typename?: 'UserAlgTagLinkPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<UserAlgTagLink>>;
};

export type UserAlgVoteLink = {
  __typename?: 'UserAlgVoteLink';
  id: Scalars['ID'];
  user: User;
  alg: Alg;
  vote_value: Scalars['Int'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type UserAlgTagVotePaginator = {
  __typename?: 'UserAlgTagVotePaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<UserAlgVoteLink>>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  name: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type TagPaginator = {
  __typename?: 'TagPaginator';
  paginatorInfo: PaginatorInfo;
  data: Array<Maybe<Tag>>;
};

export type TagFilterInput = {
  __typename?: 'TagFilterInput';
  id?: Maybe<Scalars['ID']>;
  search?: Maybe<Scalars['String']>;
  created_by?: Maybe<Scalars['String']>;
};

export type Auth = {
  __typename?: 'Auth';
  type: Scalars['String'];
  token: Scalars['String'];
  expiration: Scalars['Int'];
  user: User;
};

export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  total: Scalars['Int'];
  count: Scalars['Int'];
};

export type UserRoleEnum = {
  __typename?: 'UserRoleEnum';
  id: Scalars['ID'];
  name: UserRole;
};

export enum UserRole {
  Normal = 'NORMAL',
  Moderator = 'MODERATOR',
  Admin = 'ADMIN'
}

export enum CaseVisualization {
  V_2D = 'V_2D',
  V_3D = 'V_3D',
  VPg3D = 'V_PG3D'
}
