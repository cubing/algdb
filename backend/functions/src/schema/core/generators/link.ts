import { BaseService, NormalService } from "../services";
import { User } from "../../services";
import {
  generateIdField,
  generateCreatedAtField,
  generateUpdatedAtField,
  generateCreatedByField,
  generateJoinableField,
  generateTypenameField,
} from "../../helpers/typeDef";
import { ObjectTypeDefinition } from "jomql";

export function generateLinkTypeDef(
  services: NormalService[],
  currentService: BaseService
): ObjectTypeDefinition {
  const typeDefFields = {};

  for (const service of services) {
    typeDefFields[service.typename] = generateJoinableField({
      allowNull: false,
      service: service,
      sqlDefinition: { unique: "compositeIndex" },
    });
  }

  return <ObjectTypeDefinition>{
    name: currentService.typename,
    description: "Link type",
    fields: {
      ...generateIdField(),
      ...generateTypenameField(currentService),
      ...typeDefFields,
      ...generateCreatedAtField(),
      ...generateUpdatedAtField(),
      ...generateCreatedByField(User),
    },
  };
}
