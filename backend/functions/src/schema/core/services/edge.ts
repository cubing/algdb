import { NormalService, SimpleService } from ".";
import { generateEdgeTypeDef } from "../generators";
import { lookupSymbol, JomqlObjectType } from "jomql";

export class EdgeService extends SimpleService {
  constructor(service: NormalService) {
    super(service.typename + "Edge");
    this.typeDef = new JomqlObjectType(generateEdgeTypeDef(service, this));
    this.presets = {
      default: {
        "*": lookupSymbol,
      },
    };
  }
}
