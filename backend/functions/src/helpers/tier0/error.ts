import { ErrorWrapper } from "jomql";

export function generateError(
  message: string,
  statusCode = 400,
  errorCode = "misc/other"
) {
  return new ErrorWrapper(message, statusCode, errorCode);
}

export function wrapError(error: Error) {
  return new ErrorWrapper(error.message, 500, "system-generated-error", error);
}

export function loginRequiredError() {
  return new ErrorWrapper(
    "Login required for this action",
    401,
    "unauthorized"
  );
}

export function missingParamsError() {
  return new ErrorWrapper(
    "Missing or invalid parameters",
    500,
    "missing-invalid-params"
  );
}

export function itemNotFoundError() {
  return new ErrorWrapper("Record was not found", 404, "not-found");
}

export function badPermissionsError() {
  return new ErrorWrapper("Insufficient permissions", 401, "not-found");
}
