import type { TypeDefSqlOptions, DataloaderFunction } from "..";

declare global {
  namespace Jomql {
    interface TypeDefinitionField {
      mysqlOptions?: TypeDefSqlOptions;
      addable?: boolean;
      updateable?: boolean;
      dataloader?: DataloaderFunction;
    }
  }
  namespace baz {
    interface foo {
      bar: string;
    }
  }
}
