import HttpException from "../config/http-error"
import {httpCode, responseMsg} from "../config/constant"
import { Request, Response, NextFunction } from "express";

/**
 * This function used for handling unexpected error
 * @param error
 * @param request
 * @param response
 * @param next
 */

export const errorHandler = (
  error: HttpException,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const status = error.statusCode || httpCode.internalError;
  const message =
    error.message || responseMsg.unexpected_error;

  response.status(status).send(message);
};