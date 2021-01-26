import { BaseService, EnumPaginatorService } from ".";
import { ServiceFunctionInputs } from "../../../types";

export class EnumService extends BaseService {
  enum;
  paginator: EnumPaginatorService;

  constructor(enumName: string, currentEnum: any) {
    super(enumName);

    this.enum = currentEnum;
    this.paginator = new EnumPaginatorService(this);
  }

  getAllRecords(inputs: ServiceFunctionInputs) {
    return Object.keys(this.enum).filter((key) => Number.isNaN(parseInt(key)));
  }
}
