import { JomqlFieldError, ScalarDefinition } from "jomql";

function validate(value, fieldPath) {
  if (value === null) return value;
  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue))
    throw new JomqlFieldError("Invalid unixTimestamp", fieldPath);

  return parsedValue;
}

export const unixTimestamp: ScalarDefinition = {
  name: "unixTimestamp",
  types: ["number"],
  description: "UNIX Timestamp (Seconds since Epoch Time)",
  serialize: validate,

  parseValue: validate,
};
