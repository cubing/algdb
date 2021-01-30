import type { ObjectTypeDefsqlOptions, DataloaderFunction } from "..";

declare global {
  namespace Jomql {
    interface ObjectTypeDefinitionField {
      mysqlOptions?: ObjectTypeDefsqlOptions;
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
