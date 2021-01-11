import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import HttpException from "../config/http-error";
import { config, httpCode, responseMsg } from "../config/constant";

/**
 * This constant is used to validate & create JWT authorize token
 * @param req
 * @param res
 * @param next
 */
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {

    // Get the jwt token from the head
    const token = req.headers.auth as string;
    let jwtPayload;

    // Validate the token and get data
    try {
        jwtPayload = (jwt.verify(token, config.jwtSecret) as any);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        if (error.name === config.token_expired) {
            res.json(new HttpException(httpCode.expiredToken, responseMsg.expire_token, null))
        } else {
            // not a valid token
            res.json(new HttpException(httpCode.unauthorized, responseMsg.unauthorizer_user, null))
        }
        return;

    }

    // The token is valid for 1 hour
    const { userId, userType } = jwtPayload;
    const newToken = jwt.sign({ userId, userType }, config.jwtSecret, {
        expiresIn: config.expiresIn
    });
    res.setHeader(config.token, newToken);

    // Call the controller
    next();
};

/**
 * This function used to check roles of logged used
 * @param roles
 */
export const checkRole = (roles: number[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const userType = res.locals.jwtPayload.userType;

        // Check authorized role
        if (roles.indexOf(userType) > -1) next();
        else res.json(new HttpException(httpCode.noPermission, responseMsg.permission_error, null))
    };
};