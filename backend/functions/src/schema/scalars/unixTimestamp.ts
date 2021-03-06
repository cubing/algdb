import { JomqlScalarType } from "jomql";

function validate(value) {
  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue)) throw true;

  return parsedValue;
}

export const unixTimestamp = new JomqlScalarType({
  name: "unixTimestamp",
  types: ["number"],
  description: "UNIX Timestamp (Seconds since Epoch Time)",
  serialize: validate,
  parseValue: validate,
});
