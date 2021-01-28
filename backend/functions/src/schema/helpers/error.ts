import { JomqlBaseError } from "jomql";

export function generateError(
  message: string,
  fieldPath: string[],
  statusCode = 400
) {
  return new JomqlBaseError({
    message,
    fieldPath,
    statusCode,
  });
}

export function itemNotFoundError(fieldPath) {
  return generateError("Record was not found", fieldPath, 404);
}

export function badPermissionsError(fieldPath) {
  return generateError("Insufficient permissions", fieldPath, 401);
}

export function invalidSqlError() {
  return generateError("Insufficient permissions", [], 401);
}
