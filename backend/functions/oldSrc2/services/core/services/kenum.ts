import { Service } from ".";

export class KenumService extends Service {
  enum;

  constructor(kenumName: string, currentEnum: any) {
    super();
    this.__typename = kenumName;
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
        .filter((key) => !Number.isNaN(parseInt(key)))
        .map((key) => this.getRecord(req, { id: key }, query))
    );
  }
}
