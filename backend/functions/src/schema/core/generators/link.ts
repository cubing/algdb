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
  const typeDef = {};

  for (const service of services) {
    typeDef[service.typename] = generateJoinableField({
      allowNull: false,
      service: service,
      sqlDefinition: { unique: "compositeIndex" },
    });
  }

  return <TypeDefinition>{
    ...generateIdField(),
    ...typeDef,
    ...generateCreatedAtField(),
    ...generateUpdatedAtField(),
    ...generateCreatedByField(User),
  };
}
