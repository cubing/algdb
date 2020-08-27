import { Response } from '../interfaces/response';
import { ErrorWrapper } from '../classes/errorWrapper';

export default {
	generateErrorResponse(error: ErrorWrapper) {
		return <Response> {
			message: error.errorMessage,
			dataType: 'string',
			data: error.errorObject?.stack,
			responseType: 'errorResponse',
			statusCode: error.statusCode
		};
	},

	generateNormalResponse(dataType: string, data: any) {
		return <Response> {
			message: "OK",
			dataType: dataType,
			data: data,
			responseType: 'successResponse',
			statusCode: 200
		};
	},

	generateResponse(message: string, dataType: string, data: any, responseType: string, statusCode: 200) {
		return <Response> {
			message: message,
			dataType: dataType,
			data: data,
			responseType: responseType,
			statusCode: statusCode
		};
	},
}