import { EnumService } from ".";
import { ServiceFunctionInputs } from "../../../types";

export class KenumService extends EnumService {
  enum;

  getAllRecords(inputs: ServiceFunctionInputs) {
    // fetches the numerical keys, which are serialized into their corresponding enum values
    return Object.keys(this.enum).filter((key) => !Number.isNaN(parseInt(key)));
  }
}
