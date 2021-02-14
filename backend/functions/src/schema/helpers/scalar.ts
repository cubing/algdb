import { ScalarDefinition } from "jomql";

export function generateEnumScalarDefinition(
  enumName: string,
  currentEnum: any
): ScalarDefinition {
  return {
    name: enumName,
    types: currentEnum.values.map((ele: any) => `"${ele.name}"`),
    description: `Enum stored as is`,
    serialize: (value: unknown) => currentEnum.fromName(value).name, // convert from NAME to NAME
    parseValue: (value: unknown) => {
      return currentEnum.fromName(value).name;
    }, // convert from NAME to NAME
  };
}

export function generateKenumScalarDefinition(
  enumName: string,
  currentEnum: any
): ScalarDefinition {
  return {
    name: enumName,
    types: currentEnum.values.map((ele: any) => `"${ele.name}"`),
    description: `Enum stored as a separate key value`,
    serialize: (value: unknown) => currentEnum.fromIndex(value).name, // convert from index to name
    parseValue: (value: unknown) => {
      return currentEnum.fromName(value).index;
    }, // convert from NAME to index
  };
}
