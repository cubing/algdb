import { JomqlScalarType } from "jomql";

function validate(value) {
  if (typeof value !== "string") throw true;
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  if (!pattern.test(value)) throw true;
  return value;
}

export const imageUrl = new JomqlScalarType({
  name: "imageUrl",
  types: ["string"],
  description: "Image URL Field",
  serialize: validate,
  parseValue: validate,
});
