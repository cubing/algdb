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
      // sql field dependencies that need to be resolved in order to process the resolver
      requiredSqlFields?: string[];
    }
  }
}
