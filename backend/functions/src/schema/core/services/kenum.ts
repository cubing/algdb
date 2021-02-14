import { EnumService } from ".";
import { ServiceFunctionInputs } from "../../../types";

export class KenumService extends EnumService {
  enum;

  getAllRecords(inputs: ServiceFunctionInputs): (number | string)[] {
    // fetches the numerical indices, which are serialized into their corresponding enum values
    return this.enum.values.map((ele) => ele.index);
  }
}
