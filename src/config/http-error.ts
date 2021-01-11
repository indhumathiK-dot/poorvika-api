import {httpCode, responseMsg} from "./constant"
/**
 * This funtion used to handle response message for front-end
 */
export default class HttpException {

    statusCode: number;
    message: string;
    data: string | null | object;

    constructor(statusCode: number, message: string, data?:any) {

      this.statusCode = statusCode || httpCode.failure;
      this.message = message || responseMsg.unknown_error;
      this.data = data || null;
    }

    /**
     * Formatting the response
     */
    setResponseData() {
      return {
        statusCode: this.statusCode,
        message: this.message,
        data: this.data
      }
    }
  }