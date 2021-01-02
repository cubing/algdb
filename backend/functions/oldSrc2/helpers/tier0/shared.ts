import * as randomstring from "randomstring";

export default class Shared {
  static generateRandomString(length = 20) {
    return randomstring.generate(length);
  }

  static getUnixTimestamp() {
    return new Date().getTime();
  }

  static validateObjectFields(obj: Object, fields: Array<String>) {
    const newObj = {};

    for (const prop in obj) {
      if (fields.includes(prop)) {
        newObj[prop] = obj[prop];
      }
    }

    return newObj;
  }

  static collapseObject(obj: Object) {
    const returnObject = <any>{};
    const checkArray = <Array<string>>[];

    for (const field in obj) {
      if (field.includes(".")) {
        //const fieldParts = field.split('.');
        const firstPart = field.substr(0, field.indexOf("."));
        const secondPart = field.substr(field.indexOf(".") + 1);
        if (!(firstPart in returnObject)) {
          returnObject[firstPart] = {};
          checkArray.push(firstPart);
        }

        returnObject[firstPart][secondPart] = obj[field];
      } else {
        //if the field is id and it is null, return null
        if (field === "id" && obj[field] === null) {
          return null;
        }
        returnObject[field] = obj[field];
      }
    }

    checkArray.forEach((field) => {
      returnObject[field] = this.collapseObject(returnObject[field]);
    });

    return returnObject;
  }

  static collapseObjectArray(objArray: Array<Object>) {
    return objArray.map((obj) => this.collapseObject(obj));
  }

  static timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static deepAssign(source: object, b: object) {
    for (const prop in b) {
      // if present in source as object in both source and b, recursive merge
      if (
        prop in source &&
        source[prop] &&
        typeof source[prop] === "object" &&
        b[prop] &&
        typeof b[prop] === "object"
      ) {
        this.deepAssign(source[prop], b[prop]);
      } else {
        //if not present in source OR there is a mismatch in the objects, overwrite the source record
        source[prop] = b[prop];
      }
    }
    return source;
  }
}
