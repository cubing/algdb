import { Enum } from "../helpers/enum";

export class filterOperatorEnum extends Enum {
  static readonly eq = new filterOperatorEnum("eq", "Equals");
  static readonly neq = new filterOperatorEnum("neq", "Not Equals");
  static readonly gt = new filterOperatorEnum("gt", "Greater Than");
  static readonly lt = new filterOperatorEnum("lt", "Less Than");
  static readonly in = new filterOperatorEnum("in", "In Array");
  static readonly nin = new filterOperatorEnum("nin", "Not In Array");
  static readonly regex = new filterOperatorEnum("regex", "Regex Match");
  static readonly like = new filterOperatorEnum("like", "Like");
}
