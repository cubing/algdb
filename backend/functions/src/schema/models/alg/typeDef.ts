import { Alg, User, UserAlgVoteLink } from "../../services";
import { JomqlBaseError, JomqlObjectType, ObjectTypeDefinition } from "jomql";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateStringField,
  generateBooleanField,
  generateIntegerField,
  generateTypenameField,
} from "../../helpers/typeDef";
import { Scalars } from "../..";
import { fetchTableRows } from "../../helpers/sql";

export default new JomqlObjectType(<ObjectTypeDefinition>{
  name: Alg.typename,
  description: "Algorithm",
  fields: {
    ...generateIdField(),
    ...generateTypenameField(Alg),
    sequence: generateStringField({
      allowNull: false,
      sqlDefinition: { unique: true },
    }),
    is_approved: generateBooleanField({
      allowNull: false,
      defaultValue: false,
    }),
    score: generateIntegerField({ allowNull: false, defaultValue: 0 }),
    // foreign sql field - MUST be leaf.
    current_user_vote: {
      type: Scalars.number,
      allowNull: true,
      sqlOptions: {
        fieldInfo: {
          field: "userAlgVoteLink/vote_value",
        },
      },
    },
    // this is currently executed once for each alg returned. not efficient
    /*     current_user_vote: {
      type: Scalars.number,
      allowNull: true,
      async resolver({ req, fieldPath, parentValue }) {
        if (!req.user) return null;

        const results = await fetchTableRows(
          {
            select: [{ field: "vote_value" }],
            from: UserAlgVoteLink.typename,
            where: {
              fields: [
                {
                  field: "user",
                  value: req.user.id,
                },
                {
                  field: "alg",
                  value: parentValue.id,
                },
              ],
            },
          },
          fieldPath
        );

        if (results.length < 1) return null;

        return results[0].vote_value;
      },
    }, */
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  },
});
