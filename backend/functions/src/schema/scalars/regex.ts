import { JomqlScalarType } from "jomql";

function validate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof RegExp)) {
    throw true;
  }

  return new RegExp(value);
}

export const regex = new JomqlScalarType({
  name: "regex",
  types: ["RegExp"],
  description: "Regex Field",
  parseValue: validate,
  serialize: validate,
});
