import { Auth } from "../../services";
import * as Scalars from "../../scalars";

export default {
  socialLogin: {
    method: "post",
    route: "/socialLogin",
    type: Auth.typename,
    isArray: false,
    allowNull: false,
    args: {
      type: {
        fields: {
          provider: { type: Scalars.string, required: true },
          code: { type: Scalars.string, required: true },
          redirect_uri: { type: Scalars.string, required: true },
        },
      },
    },
    resolver: ({ req, args, query, fieldPath }) =>
      Auth.socialLogin({ req, args, query, fieldPath }),
  },
};
