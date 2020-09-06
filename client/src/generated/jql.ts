export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type Query = {
  __typename?: 'Query'
  getCurrentUser?: Maybe<User>
  getUser: User
  getMultipleUser: UserPaginator
  getPuzzle: Puzzle
  getMultiplePuzzle: PuzzlePaginator
  getAlgset: Algset
  getMultipleAlgset: AlgsetPaginator
  getSubset: Subset
  getMultipleSubset: SubsetPaginator
  getAlgcase: Algcase
  getMultipleAlgcase: AlgcasePaginator
  getAlg: Alg
  getMultipleAlg: AlgPaginator
  getAlgAlgcaseLink: AlgAlgcaseLink
  getMultipleAlgAlgcaseLink: AlgAlgcaseLinkPaginator
  getUserAlgTagLink: UserAlgTagLink
  getMultipleUserAlgTagLink: UserAlgTagLinkPaginator
  getTag: Tag
  getMultipleTag: TagPaginator
}

export type QueryGetUserArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleUserArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
}

export type QueryGetPuzzleArgs = {
  id: Scalars['ID']
}

export type QueryGetMultiplePuzzleArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
}

export type QueryGetAlgsetArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleAlgsetArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  puzzle?: Maybe<Scalars['String']>
}

export type QueryGetSubsetArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleSubsetArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  puzzle?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
  parent?: Maybe<Scalars['String']>
}

export type QueryGetAlgcaseArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleAlgcaseArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
  subset?: Maybe<Scalars['String']>
}

export type QueryGetAlgArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleAlgArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
  subset?: Maybe<Scalars['String']>
}

export type QueryGetAlgAlgcaseLinkArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleAlgAlgcaseLinkArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  alg?: Maybe<Scalars['String']>
  algcase?: Maybe<Scalars['String']>
  subset?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
  puzzle?: Maybe<Scalars['String']>
}

export type QueryGetUserAlgTagLinkArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleUserAlgTagLinkArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  alg?: Maybe<Scalars['String']>
  user?: Maybe<Scalars['String']>
  tag?: Maybe<Scalars['String']>
}

export type QueryGetTagArgs = {
  id: Scalars['ID']
}

export type QueryGetMultipleTagArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  deleteUser: User
  updateUser: User
  loginUser: Auth
  socialLogin: Auth
  deletePuzzle: Puzzle
  updatePuzzle: Puzzle
  createPuzzle: Puzzle
  deleteAlgset: Algset
  updateAlgset: Algset
  createAlgset: Algset
  deleteSubset: Subset
  updateSubset: Subset
  createSubset: Subset
  deleteAlgcase: Algcase
  updateAlgcase: Algcase
  createAlgcase: Algcase
  deleteAlg: Alg
  updateAlg: Alg
  createAlg: Alg
  deleteAlgAlgcaseLink: AlgAlgcaseLink
  updateAlgAlgcaseLink: AlgAlgcaseLink
  createAlgAlgcaseLink: AlgAlgcaseLink
  deleteUserAlgTagLink: UserAlgTagLink
  updateUserAlgTagLink: UserAlgTagLink
  createUserAlgTagLink: UserAlgTagLink
  deleteTag: Tag
  updateTag: Tag
  createTag: Tag
}

export type MutationDeleteUserArgs = {
  id: Scalars['ID']
}

export type MutationUpdateUserArgs = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  avatar?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  is_public?: Maybe<Scalars['Boolean']>
  role?: Maybe<UserRole>
}

export type MutationLoginUserArgs = {
  email: Scalars['String']
  password: Scalars['String']
}

export type MutationSocialLoginArgs = {
  provider: Scalars['String']
  code: Scalars['String']
}

export type MutationDeletePuzzleArgs = {
  id: Scalars['ID']
}

export type MutationUpdatePuzzleArgs = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  code?: Maybe<Scalars['String']>
}

export type MutationCreatePuzzleArgs = {
  name: Scalars['String']
  code: Scalars['String']
}

export type MutationDeleteAlgsetArgs = {
  id: Scalars['ID']
}

export type MutationUpdateAlgsetArgs = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  mask?: Maybe<Scalars['String']>
  visualization?: Maybe<CaseVisualization>
}

export type MutationCreateAlgsetArgs = {
  name?: Maybe<Scalars['String']>
  mask?: Maybe<Scalars['String']>
  visualization?: Maybe<CaseVisualization>
  puzzle?: Maybe<Puzzle>
  score?: Maybe<Scalars['Int']>
}

export type MutationDeleteSubsetArgs = {
  id: Scalars['ID']
}

export type MutationUpdateSubsetArgs = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  mask?: Maybe<Scalars['String']>
  visualization?: Maybe<CaseVisualization>
}

export type MutationCreateSubsetArgs = {
  name?: Maybe<Scalars['String']>
  mask?: Maybe<Scalars['String']>
  visualization?: Maybe<CaseVisualization>
  puzzle?: Maybe<Puzzle>
  algset?: Maybe<Algset>
  parent?: Maybe<Subset>
}

export type MutationDeleteAlgcaseArgs = {
  id: Scalars['ID']
}

export type MutationUpdateAlgcaseArgs = {
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
}

export type MutationCreateAlgcaseArgs = {
  name?: Maybe<Scalars['String']>
  mask?: Maybe<Scalars['String']>
  puzzle?: Maybe<Puzzle>
  algset?: Maybe<Algset>
  subset?: Maybe<Subset>
}

export type MutationDeleteAlgArgs = {
  id: Scalars['ID']
}

export type MutationUpdateAlgArgs = {
  id: Scalars['ID']
}

export type MutationCreateAlgArgs = {
  sequence?: Maybe<Scalars['String']>
}

export type MutationDeleteAlgAlgcaseLinkArgs = {
  id: Scalars['ID']
}

export type MutationUpdateAlgAlgcaseLinkArgs = {
  id: Scalars['ID']
}

export type MutationCreateAlgAlgcaseLinkArgs = {
  alg?: Maybe<Alg>
  algcase?: Maybe<Algcase>
}

export type MutationDeleteUserAlgTagLinkArgs = {
  id: Scalars['ID']
}

export type MutationUpdateUserAlgTagLinkArgs = {
  id: Scalars['ID']
}

export type MutationCreateUserAlgTagLinkArgs = {
  user?: Maybe<User>
  alg?: Maybe<Alg>
  tag?: Maybe<Tag>
}

export type MutationDeleteTagArgs = {
  id: Scalars['ID']
}

export type MutationUpdateTagArgs = {
  id: Scalars['ID']
}

export type MutationCreateTagArgs = {
  name?: Maybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  wca_id?: Maybe<Scalars['String']>
  email: Scalars['String']
  name?: Maybe<Scalars['String']>
  avatar?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  is_public: Scalars['Boolean']
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
  role: UserRoleEnum
}

export type UserPaginator = {
  __typename?: 'UserPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<User>>
}

export type Puzzle = {
  __typename?: 'Puzzle'
  id: Scalars['ID']
  name: Scalars['String']
  code: Scalars['String']
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
  algsets: AlgsetPaginator
}

export type PuzzleAlgsetsArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
}

export type PuzzlePaginator = {
  __typename?: 'PuzzlePaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<Puzzle>>
}

export type Algset = {
  __typename?: 'Algset'
  id: Scalars['ID']
  name: Scalars['String']
  mask?: Maybe<Scalars['String']>
  visualization: CaseVisualizationEnum
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
  puzzle: Puzzle
  algcases: AlgcasePaginator
  subsets: SubsetPaginator
  score: Scalars['Int']
}

export type AlgsetAlgcasesArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  subset?: Maybe<Scalars['String']>
}

export type AlgsetSubsetsArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  puzzle?: Maybe<Scalars['String']>
  parent?: Maybe<Scalars['String']>
}

export type AlgsetPaginator = {
  __typename?: 'AlgsetPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<Algset>>
}

export type Subset = {
  __typename?: 'Subset'
  id: Scalars['ID']
  name: Scalars['String']
  mask?: Maybe<Scalars['String']>
  visualization: CaseVisualizationEnum
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
  puzzle: Puzzle
  algset: Algset
  parent?: Maybe<Subset>
  algcases: Algcase
  subsets: Subset
}

export type SubsetAlgcasesArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
}

export type SubsetSubsetsArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  puzzle?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
}

export type SubsetPaginator = {
  __typename?: 'SubsetPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<Subset>>
}

export type Algcase = {
  __typename?: 'Algcase'
  id: Scalars['ID']
  name: Scalars['String']
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
  puzzle: Puzzle
  algset: Algset
  subset: Subset
  algs: AlgAlgcaseLinkPaginator
}

export type AlgcaseAlgsArgs = {
  id?: Maybe<Scalars['String']>
  first?: Maybe<Scalars['Int']>
  after?: Maybe<Scalars['ID']>
  search?: Maybe<Scalars['String']>
  sortBy?: Maybe<Array<Maybe<Scalars['String']>>>
  sortDesc?: Maybe<Array<Maybe<Scalars['Boolean']>>>
  created_by?: Maybe<Scalars['String']>
  alg?: Maybe<Scalars['String']>
  subset?: Maybe<Scalars['String']>
  algset?: Maybe<Scalars['String']>
  puzzle?: Maybe<Scalars['String']>
}

export type AlgcasePaginator = {
  __typename?: 'AlgcasePaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<Algcase>>
}

export type Alg = {
  __typename?: 'Alg'
  id: Scalars['ID']
  sequence: Scalars['String']
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
}

export type AlgPaginator = {
  __typename?: 'AlgPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<Alg>>
}

export type AlgAlgcaseLink = {
  __typename?: 'AlgAlgcaseLink'
  id: Scalars['ID']
  alg: Alg
  algcase: Algcase
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
}

export type AlgAlgcaseLinkPaginator = {
  __typename?: 'AlgAlgcaseLinkPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<AlgAlgcaseLink>>
}

export type UserAlgTagLink = {
  __typename?: 'UserAlgTagLink'
  id: Scalars['ID']
  user: User
  alg: Alg
  tag: Scalars['String']
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
}

export type UserAlgTagLinkPaginator = {
  __typename?: 'UserAlgTagLinkPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<UserAlgTagLink>>
}

export type Tag = {
  __typename?: 'Tag'
  id: Scalars['ID']
  name: Scalars['String']
  created_at: Scalars['Int']
  updated_at?: Maybe<Scalars['Int']>
  created_by: User
}

export type TagPaginator = {
  __typename?: 'TagPaginator'
  paginatorInfo: PaginatorInfo
  data: Array<Maybe<Tag>>
}

export type Auth = {
  __typename?: 'Auth'
  type: Scalars['String']
  token: Scalars['String']
  expiration: Scalars['Int']
  user: User
}

export type PaginatorInfo = {
  __typename?: 'PaginatorInfo'
  total: Scalars['Int']
  count: Scalars['Int']
}

export type UserRoleEnum = {
  __typename?: 'UserRoleEnum'
  id: Scalars['ID']
  name: UserRole
}

export type CaseVisualizationEnum = {
  __typename?: 'CaseVisualizationEnum'
  id: Scalars['ID']
  name: CaseVisualization
}

export enum UserRole {
  Normal = 'NORMAL',
  Moderator = 'MODERATOR',
  Admin = 'ADMIN',
}

export enum CaseVisualization {
  V_2D = 'V_2D',
  V_3D = 'V_3D',
  VPg3D = 'V_PG3D',
}
