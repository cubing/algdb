import User from './user/user.resolver';
import Auth from './auth/auth.resolver';
import Puzzle from './puzzle/puzzle.resolver';
import Algset from './algset/algset.resolver';
import Subset from './subset/subset.resolver';
import Algcase from './algcase/algcase.resolver';
import Alg from './alg/alg.resolver';
import AlgAlgCaseLink from './link/algAlgcaseLink/algAlgcaseLink.resolver';
import UserAlgTagLink from './link/userAlgTagLink/userAlgTagLink.resolver';
import Tag from './tag/tag.resolver';

const rootResolvers = [User, Auth, Puzzle, Algset, Subset, Algcase, Alg, AlgAlgCaseLink, UserAlgTagLink, Tag];

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



