import { JomqlFieldError, ScalarDefinition } from "jomql";

function validate(value, fieldPath) {
  if (value === null) return value;
  else if (typeof value === "string") {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    if (!pattern.test(value))
      throw new JomqlFieldError("Invalid URL", fieldPath);
  } else {
    throw new JomqlFieldError("Invalid URL", fieldPath);
  }
  return value;
}

export const imageUrl: ScalarDefinition = {
  name: "imageUrl",
  types: ["string"],
  serialize: validate,
  parseValue: validate,
};
