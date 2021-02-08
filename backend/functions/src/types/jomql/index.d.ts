import type { ObjectTypeDefSqlOptions, DataloaderFunction } from "..";

declare global {
  namespace Jomql {
    interface ObjectTypeDefinitionField {
      // mysqlOptions?: ObjectTypeDefsqlOptions;
      sqlOptions?: ObjectTypeDefSqlOptions;
      addable?: boolean;
      updateable?: boolean;
      dataloader?: DataloaderFunction;
      deleter?: Function;
      setter?: Function;
      updater?: Function;
    }
  }
}
