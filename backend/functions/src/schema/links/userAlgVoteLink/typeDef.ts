import { UserAlgVoteLink } from "../../services";
import { JomqlObjectType, ObjectTypeDefinitionField } from "jomql";
import { generateIntegerField } from "../../helpers/typeDef";
import { generateLinkTypeDef } from "../../core/generators/link";

export default new JomqlObjectType(
  generateLinkTypeDef(UserAlgVoteLink.services, UserAlgVoteLink, {
    vote_value: <ObjectTypeDefinitionField>(
      generateIntegerField({ allowNull: false })
    ),
  })
);
