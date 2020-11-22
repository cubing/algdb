import { Service } from ".";

export class EnumService extends Service {
  enum;

  constructor(enumName: string, currentEnum: any) {
    super();
    this.__typename = enumName;
    this.presets = {
      default: {
        id: null,
        name: null,
      },
    };

    this.enum = currentEnum;

    this.hasKeys = false;
  }

  getAllRecords(req, args, query) {
    return Promise.all(
      Object.keys(this.enum)
        .filter((key) => Number.isNaN(parseInt(key)))
        .map((key) => this.getRecord(req, { name: key }, query))
    );
  }
}
