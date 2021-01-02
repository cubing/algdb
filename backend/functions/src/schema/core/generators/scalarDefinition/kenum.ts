import { JomqlFieldError, ScalarDefinition } from "jomql";

export function generateKenumScalarDefinition(
  enumName: string,
  currentEnum: any
): ScalarDefinition {
  const enumValues = Object.keys(currentEnum).filter(
    (k) => !Number.isNaN(Number(currentEnum[k]))
  );

  return {
    name: enumName,
    types: enumValues.map((ele) => `"${ele}"`),
    serialize: (value, fieldPath) => {
      // convert from key to value
      if (typeof value !== "string")
        throw new JomqlFieldError("Invalid enum", fieldPath);

      if (!(value in currentEnum))
        throw new JomqlFieldError("Invalid enum", fieldPath);

      return currentEnum[value];
    },
    parseValue: (value, fieldPath) => {
      // convert from key to value
      if (typeof value !== "string")
        throw new JomqlFieldError("Invalid enum", fieldPath);

      if (!(value in currentEnum))
        throw new JomqlFieldError("Invalid enum", fieldPath);

      return currentEnum[value];
    },
  };
}
