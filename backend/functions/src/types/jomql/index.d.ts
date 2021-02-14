import type {
  ObjectTypeDefSqlOptions,
  DataloaderFunction,
  CustomResolverFunction,
} from "..";

declare global {
  namespace Jomql {
    interface ObjectTypeDefinitionField {
      // mysqlOptions?: ObjectTypeDefsqlOptions;
      sqlOptions?: ObjectTypeDefSqlOptions;
      addable?: boolean;
      updateable?: boolean;
      dataloader?: DataloaderFunction;
      deleter?: CustomResolverFunction;
      setter?: CustomResolverFunction;
      updater?: CustomResolverFunction;
    }
  }
}
