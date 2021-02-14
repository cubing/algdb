import { Enum } from "../helpers/enum";

export class userPermissionEnum extends Enum {
  static readonly A_A = new userPermissionEnum("A_A");
  static readonly user_x = new userPermissionEnum("user_x");
  static readonly user_get = new userPermissionEnum("user_get");
  static readonly user_getMultiple = new userPermissionEnum("user_getMultiple");
  static readonly user_update = new userPermissionEnum("user_update");
  static readonly user_create = new userPermissionEnum("user_create");
  static readonly user_delete = new userPermissionEnum("user_delete");
}
