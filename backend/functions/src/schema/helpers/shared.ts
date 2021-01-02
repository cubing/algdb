export function getUnixTimestamp() {
  return new Date().getTime();
}

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type stringKeyObject = { [x: string]: any };

export function isObject(ele: unknown): ele is stringKeyObject {
  return Object.prototype.toString.call(ele) === "[object Object]";
}

export function deepAssign(source: object, b: object) {
  for (const prop in b) {
    // if present in source as object in both source and b,
    if (prop in source) {
      // recursive merge
      if (isObject(source[prop]) && isObject(b[prop])) {
        deepAssign(source[prop], b[prop]);
      }

      // if source and b both have arrays, merge them
      if (Array.isArray(source[prop]) && Array.isArray(b[prop])) {
        source[prop].push(...b[prop]);
      }
    } else {
      //if not present in source OR there is a mismatch in the objects, overwrite the source record
      source[prop] = b[prop];
    }
  }
  return source;
}

export function atob(str: string) {
  return Buffer.from(str).toString("base64");
}

export function btoa(str: string) {
  return Buffer.from(str, "base64").toString("ascii");
}

export function capitalizeString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseString(str: string) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
