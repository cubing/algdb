import { NormalService } from ".";
import { generateLinkTypeDef } from "../generators";
import { linkDefs } from "../../links";
import { typeDefs } from "../../typeDefs";
export class LinkService extends NormalService {
  constructor(services: NormalService[], name?: string) {
    super(name);
    this.typeDef = generateLinkTypeDef(services, this);

    // register linkDef
    linkDefs.set(this.typename, {
      types: new Set(services.map((service) => service.typename)),
    });

    // register typeDef
    typeDefs.set(this.typename, this.typeDef);
  }
}
