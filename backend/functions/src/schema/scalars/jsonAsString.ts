import { JomqlScalarType } from "jomql";

export const jsonAsString = new JomqlScalarType({
  name: "jsonAsString",
  types: ["unknown"],
  description: "Valid generic JSON that is stored in database as string",
  serialize(value) {
    if (typeof value !== "string") throw true;

    return JSON.parse(value);
  },

  parseValue(value) {
    return JSON.stringify(value);
  },
});
