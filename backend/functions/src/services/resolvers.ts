import User from './user/user.resolver';
import Auth from './auth/auth.resolver';


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

mergeResolvers([User, Auth]);

export default resolvers;



