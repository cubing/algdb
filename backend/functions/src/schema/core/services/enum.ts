import { BaseService } from ".";

export class EnumService extends BaseService {
  enum;

  constructor(enumName: string, currentEnum: any) {
    super(enumName);

    this.enum = currentEnum;
  }

  getAllRecords(req, args, query) {
    return Object.keys(this.enum).filter((key) => Number.isNaN(parseInt(key)));
  }
}
