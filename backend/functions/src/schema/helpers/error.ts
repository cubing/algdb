import { JomqlBaseError } from "jomql";

export function generateError(
  message: string,
  fieldPath: string[],
  statusCode = 400
): JomqlBaseError {
  return new JomqlBaseError({
    message,
    fieldPath,
    statusCode,
  });
}

export function itemNotFoundError(fieldPath: string[]): JomqlBaseError {
  return generateError("Record was not found", fieldPath, 404);
}

export function badPermissionsError(fieldPath: string[]): JomqlBaseError {
  return generateError("Insufficient permissions", fieldPath, 401);
}

export function invalidSqlError(): JomqlBaseError {
  return generateError("Insufficient permissions", [], 401);
}
