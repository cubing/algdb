export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
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
  getUser: User;
  getUsers: Array<Maybe<User>>;
  getPuzzles: Array<Maybe<Puzzle>>;
  getTags: Array<Maybe<Tag>>;
  getAlgs: Array<Maybe<Alg>>;
  getAlgSetSubsetTags: Array<Maybe<Tag>>;
  getCases: Array<Maybe<Case>>;
};

export type QueryGetUserArgs = {
  id: Scalars['ID'];
};

export type QueryGetAlgsArgs = {
  tag_names?: Maybe<Array<Maybe<Scalars['String']>>>;
  user_id: Scalars['ID'];
};

export type QueryGetAlgSetSubsetTagsArgs = {
  algset_id: Scalars['ID'];
};

export type QueryGetCasesArgs = {
  algsetsubsettag_name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  loginUser: Auth;
  socialLogin: Auth;
  createPuzzle: Puzzle;
  createAlgSet: AlgSet;
  createCase: Case;
  createAlg: Alg;
  createTag: Tag;
  voteAlg: Alg;
  updateUser: User;
  createUserAlgTagLink: UserAlgTagLink;
  createAlgSetSubetTag: AlgSetSubsetTag;
  createAlgSetSubsetTagLink: AlgSetSubsetTagLink;
};

export type MutationLoginUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};

export type MutationSocialLoginArgs = {
  provider: Scalars['String'];
  code: Scalars['String'];
};

export type MutationCreateAlgSetArgs = {
  puzzle_id: Scalars['ID'];
};

export type MutationCreateCaseArgs = {
  algset_id: Scalars['ID'];
};

export type MutationCreateAlgArgs = {
  case_id: Scalars['ID'];
};

export type MutationCreateTagArgs = {
  name: Scalars['String'];
};

export type MutationVoteAlgArgs = {
  alg_id: Scalars['ID'];
  upvote: Scalars['Boolean'];
};

export type MutationUpdateUserArgs = {
  user_id: Scalars['ID'];
  is_public?: Maybe<Scalars['Boolean']>;
};

export type MutationCreateUserAlgTagLinkArgs = {
  tag_id: Scalars['ID'];
  alg_id: Scalars['ID'];
};

export type MutationCreateAlgSetSubetTagArgs = {
  algset_id: Scalars['ID'];
  name: Scalars['String'];
};

export type MutationCreateAlgSetSubsetTagLinkArgs = {
  algsettag_id: Scalars['ID'];
  case_id: Scalars['ID'];
};

export type Auth = {
  __typename?: 'Auth';
  type: Scalars['String'];
  token: Scalars['String'];
  user: User;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  provider: Scalars['String'];
  provider_id: Scalars['String'];
  wca_id: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  avatar: Scalars['String'];
  country: Scalars['String'];
  is_public: Scalars['Boolean'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  role?: Maybe<UserRole>;
  taggedAlgs: Array<Maybe<Alg>>;
  color_scheme?: Maybe<UserPuzzleColorScheme>;
};

export type UserTaggedAlgsArgs = {
  tag_names?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UserColor_SchemeArgs = {
  puzzle_id: Scalars['ID'];
};

export enum UserRole {
  Admin = 'ADMIN',
  Moderator = 'MODERATOR',
  Normal = 'NORMAL',
}

export enum CaseVisualization {
  VPg3D = 'V_PG3D',
  V_2D = 'V_2D',
  V_3D = 'V_3D',
}

export type UserPuzzleColorScheme = {
  __typename?: 'UserPuzzleColorScheme';
  id: Scalars['ID'];
  user: User;
  puzzle: Puzzle;
  colors: Scalars['String'];
};

export type Puzzle = {
  __typename?: 'Puzzle';
  id: Scalars['ID'];
  name: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  algSets: Array<Maybe<AlgSet>>;
};

export type AlgSet = {
  __typename?: 'AlgSet';
  id: Scalars['ID'];
  name: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  puzzle: Puzzle;
  subsets: Array<Maybe<AlgSetSubsetTagLink>>;
  cases: Array<Maybe<Case>>;
  has_subsets: Scalars['Boolean'];
};

export type Subset = {
  __typename?: 'Subset';
  id: Scalars['ID'];
  name: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  parent?: Maybe<Subset>;
  algset: AlgSet;
  puzzle: Puzzle;
  subsets: Array<Maybe<AlgSetSubsetTagLink>>;
  cases: Array<Maybe<Case>>;
};

export type Case = {
  __typename?: 'Case';
  id: Scalars['ID'];
  name: Scalars['String'];
  mask: Scalars['String'];
  visualization: CaseVisualization;
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  algset: AlgSet;
  algs: Array<Maybe<Alg>>;
};

export type Alg = {
  __typename?: 'Alg';
  id: Scalars['ID'];
  sequence: Scalars['String'];
  puzzle: Puzzle;
  algset: AlgSet;
  case: Case;
  up_votes: Scalars['Int'];
  total_votes: Scalars['Int'];
  current_user_vote?: Maybe<Scalars['Boolean']>;
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
  current_user_tags?: Maybe<Array<Maybe<Tag>>>;
};

export type Tag = {
  __typename?: 'Tag';
  id: Scalars['ID'];
  type: Scalars['String'];
  name: Scalars['String'];
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type UserAlgTagLink = {
  __typename?: 'UserAlgTagLink';
  id: Scalars['ID'];
  user: User;
  tag: Tag;
  alg: Alg;
};

export type SubsetTag = {
  __typename?: 'SubsetTag';
  id: Scalars['ID'];
  name: Scalars['String'];
  algset: AlgSet;
  created_at: Scalars['Int'];
  updated_at?: Maybe<Scalars['Int']>;
  created_by: User;
};

export type AlgSetSubsetTagLink = {
  __typename?: 'AlgSetSubsetTagLink';
  id: Scalars['ID'];
  algset: AlgSet;
  subsetTag: SubsetTag;
};

export type AlgSetSubsetTag = {
  __typename?: 'AlgSetSubsetTag';
};
