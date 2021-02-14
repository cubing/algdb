import { Kenum } from "../helpers/enum";

export class userRoleKenum extends Kenum {
  static readonly NONE = new userRoleKenum("NONE", 1);
  static readonly NORMAL = new userRoleKenum("NORMAL", 2);
  static readonly ADMIN = new userRoleKenum("ADMIN", 3);
}
