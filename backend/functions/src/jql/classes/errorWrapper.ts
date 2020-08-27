export class ErrorWrapper {
  constructor(public errorMessage: string, public statusCode: number, public errorCode: string, public errorObject?: Error) {
    if(errorObject) {
      this.errorObject = errorObject;
    } else {
      this.errorObject = new Error(errorMessage);
    }
  }
};