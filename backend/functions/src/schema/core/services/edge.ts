import { NormalService, SimpleService } from ".";
import { generateEdgeTypeDef } from "../generators";
import { typeDefs } from "../../typeDefs";
import { lookupSymbol } from "jomql";

export class EdgeService extends SimpleService {
  constructor(service: NormalService) {
    super(service.typename + "Edge");
    this.typeDef = generateEdgeTypeDef(service, this);
    this.presets = {
      default: {
        "*": lookupSymbol,
      },
    };

    // register the typeDef
    typeDefs.set(this.typename, this.typeDef);
  }
}
