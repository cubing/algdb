import { JomqlScalarType } from "jomql";

function validate(value: unknown) {
  const parsedValue = Number(value);
  if (Number.isNaN(Number(value))) throw true;

  return parsedValue;
}

export const number = new JomqlScalarType({
  name: "number",
  types: ["number"],
  description: "Numeric value",
  parseValue: validate,
  serialize: validate,
});
