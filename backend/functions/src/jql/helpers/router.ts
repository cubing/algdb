import responseHelper from './response';
import { ErrorWrapper } from '../classes/errorWrapper';

export default {
  externalFnWrapper(externalFn) {
    return async function(req, res) {
      try {
        const responseObject = responseHelper.generateNormalResponse("object", await externalFn(req));
        
        res.header("Content-Type", "application/json");
        res.status(responseObject.statusCode || 200).send(responseObject);
      } catch (err) {
        console.log(err);
        //if not a wrapped error, wrap it        
        const errorResponseObject = responseHelper.generateErrorResponse((err instanceof ErrorWrapper) ? err : new ErrorWrapper(err.message, 500, "system-generated-error", err));

        return res.status(errorResponseObject.statusCode).send(errorResponseObject);
      }
    }
  }
};