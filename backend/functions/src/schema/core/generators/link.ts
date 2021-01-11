import { NormalService } from "../services";
import { User } from "../../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateJoinableField,
} from "../../helpers/typeDef";
import { TypeDefinition } from "jomql";

export function generateLinkTypeDef(services: NormalService[]) {
  const typeDefFields = {};

  for (const service of services) {
    typeDefFields[service.typename] = generateJoinableField({
      allowNull: false,
      service: service,
      sqlDefinition: { unique: "compositeIndex" },
    });
  }

  return <TypeDefinition>{
    description: "Link type",
    fields: {
      ...generateIdField(),
      ...typeDefFields,
      ...generateCreatedAtField(),
      ...generateUpdatedAtField(),
      ...generateCreatedByField(User),
    },
  };
}
