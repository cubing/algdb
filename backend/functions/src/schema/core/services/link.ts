import { NormalService } from ".";
import { generateLinkTypeDef } from "../generators";
import { linkDefs } from "../../links";
import { JomqlObjectType } from "jomql";
import { PaginatedService } from "./paginated";
export class LinkService extends PaginatedService {
  services: NormalService[];
  constructor(
    services: NormalService[],
    generateTypeDef = true,
    name?: string
  ) {
    super(name);
    this.services = services;
    if (generateTypeDef) {
      this.typeDef = new JomqlObjectType(generateLinkTypeDef(services, this));
    }

    const servicesMap: Map<string, NormalService> = new Map();

    services.forEach((service) => {
      servicesMap.set(service.typename, service);
    });
    // register linkDef
    linkDefs.set(this.typename, {
      types: servicesMap,
      service: this,
    });
  }
}
