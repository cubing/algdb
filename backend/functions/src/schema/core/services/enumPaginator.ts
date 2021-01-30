import { EnumService, SimpleService } from ".";
import { generateEnumPaginatorTypeDef } from "../generators";
import { JomqlObjectType } from "jomql";

export class EnumPaginatorService extends SimpleService {
  constructor(service: EnumService) {
    super(service.typename + "EnumPaginator");
    this.presets = {
      default: {
        values: true,
      },
    };

    this.setTypeDef(
      new JomqlObjectType(generateEnumPaginatorTypeDef(service, this))
    );
  }
}
