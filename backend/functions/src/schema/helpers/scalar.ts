import { ScalarDefinition } from "jomql";

export function generateEnumScalarDefinition(
  enumName: string,
  currentEnum: any
): ScalarDefinition {
  const enumValues = Object.keys(currentEnum).filter(
    (k) => !Number.isNaN(Number(currentEnum[k]))
  );

  const validate = (value) => {
    // convert from key to value
    if (typeof value !== "string") throw true;

    if (!(value in currentEnum)) throw true;

    return value;
  };

  return {
    name: enumName,
    types: enumValues.map((ele) => `"${ele}"`),
    description: `Enum stored as is`,
    serialize: validate,
    parseValue: validate,
  };
}

export function generateKenumScalarDefinition(
  enumName: string,
  currentEnum: any
): ScalarDefinition {
  const enumValues = Object.keys(currentEnum).filter(
    (k) => !Number.isNaN(Number(currentEnum[k]))
  );
  const validate = (value) => {
    // convert from key to value
    if (typeof value !== "string") throw true;

    if (!(value in currentEnum)) throw true;

    return currentEnum[value];
  };
  return {
    name: enumName,
    types: enumValues.map((ele) => `"${ele}"`),
    description: `Enum stored as a separate key value`,
    serialize: validate,
    parseValue: validate,
  };
}
