import { ErrorWrapper } from 'jomql';

export default {
  generateError(message: string, statusCode = 400, errorCode = "misc/other") {
    return new ErrorWrapper(message, statusCode, errorCode);
  },

  wrapError(error: Error) {
    return new ErrorWrapper(error.message, 500, "system-generated-error", error);
  },

  loginRequiredError() {
    return new ErrorWrapper("Login required for this action", 401, "unauthorized");
  },

  missingParamsError() {
    return new ErrorWrapper("Missing or invalid parameters", 500, "missing-invalid-params");
  },

  itemNotFoundError() {
    return new ErrorWrapper("Record was not found", 404, "not-found");
  },

  badPermissionsError() {
    return new ErrorWrapper("Insufficient permissions", 401, "not-found");
  },
};