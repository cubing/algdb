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
import { ObjectTypeDefinition, ObjectTypeDefinitionField } from "jomql";

export function generateLinkTypeDef(
  services: NormalService[],
  currentService: BaseService,
  additionalFields?: { [x: string]: ObjectTypeDefinitionField }
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
      ...additionalFields,
      ...generateCreatedAtField(),
      ...generateUpdatedAtField(),
      ...generateCreatedByField(User),
    },
  };
}
