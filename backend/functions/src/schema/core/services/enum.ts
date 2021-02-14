import { BaseService, EnumPaginatorService } from ".";
import { ServiceFunctionInputs } from "../../../types";
import { generateEnumRootResolver } from "../../helpers/rootResolver";
import { JomqlRootResolverType } from "jomql";

export class EnumService extends BaseService {
  enum;
  paginator: EnumPaginatorService;
  rootResolvers: { [x: string]: JomqlRootResolverType };

  constructor(enumName: string, currentEnum: any) {
    super(enumName);

    this.enum = currentEnum;
    this.paginator = new EnumPaginatorService(this);

    this.rootResolvers = generateEnumRootResolver(this);
  }

  getAllRecords(inputs: ServiceFunctionInputs): (number | string)[] {
    return this.enum.values.map((ele) => ele.name);
  }
}
