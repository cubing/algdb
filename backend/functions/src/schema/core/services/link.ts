import { NormalService } from ".";
import { generateLinkTypeDef } from "../generators";
import { linkDefs } from "../../links";
import { JomqlObjectType } from "jomql";
export class LinkService extends NormalService {
  constructor(services: NormalService[], name?: string) {
    super(name);
    this.typeDef = new JomqlObjectType(generateLinkTypeDef(services, this));

    const servicesMap = new Map();

    services.forEach((service) => {
      servicesMap.set(service.typename, service);
    });
    // register linkDef
    linkDefs.set(this.typename, {
      types: servicesMap,
    });
  }
}
