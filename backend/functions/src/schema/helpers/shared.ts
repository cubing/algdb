import { StringKeyObject } from "../../types";
export function getUnixTimestamp(): number {
  return new Date().getTime();
}

export function timeout(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isObject(ele: unknown): ele is StringKeyObject {
  return Object.prototype.toString.call(ele) === "[object Object]";
}

export function deepAssign(
  target: StringKeyObject,
  source: StringKeyObject
): StringKeyObject {
  for (const prop in source) {
    const targetProp = target[prop];
    const sourceProp = source[prop];
    // if present in source as object in both source and b,
    if (prop in target) {
      // recursive merge
      if (isObject(targetProp) && isObject(sourceProp)) {
        deepAssign(targetProp, sourceProp);
      }

      // if source and b both have arrays, merge them
      if (Array.isArray(targetProp) && Array.isArray(sourceProp)) {
        targetProp.push(...sourceProp);
      }
    } else {
      //if not present in source OR there is a mismatch in the objects, overwrite the source record
      target[prop] = sourceProp;
    }
  }
  return target;
}

export function atob(str: string): string {
  return Buffer.from(str).toString("base64");
}

export function btoa(str: string): string {
  return Buffer.from(str, "base64").toString("ascii");
}

export function capitalizeString(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function lowercaseString(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
