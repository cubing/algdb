import { Alg } from "../../services";
import { generateBaseRootResolvers } from "../../helpers/rootResolver";
import * as Scalars from "../../scalars";
import {
  JomqlRootResolverType,
  JomqlInputFieldType,
  JomqlInputType,
  JomqlInputTypeLookup,
} from "jomql";

export default {
  ...generateBaseRootResolvers(Alg, [
    "get",
    "getMultiple",
    "delete",
    "create",
    "update",
  ]),

  createAndLinkAlg: new JomqlRootResolverType({
    name: "createAndLinkAlg",
    restOptions: {
      method: "post",
      route: "/createAndLinkAlg",
      query: Alg.presets.default,
    },
    type: Alg.typeDefLookup,
    allowNull: false,
    args: new JomqlInputFieldType({
      required: true,
      type: new JomqlInputType({
        name: "createAndLinkAlg",
        fields: {
          sequence: new JomqlInputFieldType({
            type: Scalars.string,
            required: true,
          }),
          is_approved: new JomqlInputFieldType({
            type: Scalars.boolean,
            required: false,
          }),
          score: new JomqlInputFieldType({
            type: Scalars.number,
            required: false,
          }),
          algcase: new JomqlInputFieldType({
            type: new JomqlInputTypeLookup("getAlgcase"),
            required: true,
          }),
        },
      }),
    }),
    resolver: ({ req, args, query, fieldPath }) =>
      Alg.createAndLinkRecord({ req, args, query, fieldPath }),
  }),
};
