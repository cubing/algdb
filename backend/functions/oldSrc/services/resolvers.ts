import User from './user/resolver';
import Auth from './auth/resolver';
import Puzzle from './puzzle/resolver';
import Algset from './algset/resolver';
import Subset from './subset/resolver';
import Algcase from './algcase/resolver';
import Alg from './alg/resolver';
import AlgAlgCaseLink from './link/algAlgcaseLink/resolver';
import AlgTagLink from './link/algTagLink/resolver';
import UserAlgTagLink from './link/userAlgTagLink/resolver';
import UserAlgVoteLink from './link/userAlgVoteLink/resolver';
import Tag from './tag/resolver';

const rootResolvers = [User, Auth, Puzzle, Algset, Subset, Algcase, Alg, AlgAlgCaseLink, AlgTagLink, UserAlgTagLink, UserAlgVoteLink, Tag];

const resolvers = {
  query: {},
  mutation: {},
  subscription: {}
};

function mergeResolvers(resolversArray: any) {
  for(const resolver of resolversArray) {
    for(const prop in resolver) {
      for(const operation in resolver[prop]) {
        resolvers[prop][operation] = resolver[prop][operation];
      }
    }
  }
}

mergeResolvers(rootResolvers);

export default resolvers;



