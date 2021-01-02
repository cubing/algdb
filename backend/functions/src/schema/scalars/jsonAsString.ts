import { JomqlFieldError, ScalarDefinition } from "jomql";

export const jsonAsString: ScalarDefinition = {
  name: "jsonAsString",
  types: ["string"],
  serialize(value, fieldPath) {
    try {
      if (!value) return value;

      if (typeof value !== "string") throw new Error();

      return JSON.parse(value);
    } catch (err) {
      throw new JomqlFieldError("Invalid JSON", fieldPath);
    }
  },

  parseValue(value, fieldPath) {
    try {
      if (!value) return value;

      return JSON.stringify(value);
    } catch (err) {
      throw new JomqlFieldError("Invalid JSON", fieldPath);
    }
  },
};
