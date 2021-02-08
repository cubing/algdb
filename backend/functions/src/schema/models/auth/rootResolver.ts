import { Auth } from "../../services";
import * as Scalars from "../../scalars";
import {
  JomqlRootResolverType,
  JomqlInputFieldType,
  JomqlInputType,
} from "jomql";

export default {
  socialLogin: new JomqlRootResolverType({
    name: "socialLogin",
    restOptions: {
      method: "post",
      route: "/socialLogin",
      query: Auth.presets.default,
    },
    type: Auth.typeDef,
    allowNull: false,
    args: new JomqlInputFieldType({
      type: new JomqlInputType({
        name: "socialLogin",
        fields: {
          provider: new JomqlInputFieldType({
            type: Scalars.string,
            required: true,
          }),
          code: new JomqlInputFieldType({
            type: Scalars.string,
            required: true,
          }),
          redirect_uri: new JomqlInputFieldType({
            type: Scalars.string,
            required: true,
          }),
        },
      }),
    }),
    resolver: ({ req, args, query, fieldPath }) =>
      Auth.socialLogin({ req, args, query, fieldPath }),
  }),
};
