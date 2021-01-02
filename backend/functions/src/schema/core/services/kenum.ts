import { BaseService } from ".";

export class KenumService extends BaseService {
  enum;

  constructor(kenumName: string, currentEnum: any) {
    super(kenumName);

    this.enum = currentEnum;
  }

  getAllRecords(req, args, query) {
    return Object.keys(this.enum).filter((key) => Number.isNaN(parseInt(key)));
  }
}
