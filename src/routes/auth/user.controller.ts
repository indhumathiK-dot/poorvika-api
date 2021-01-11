import { IUser, User } from "../../models/employee"
import { Request, Response } from "express";
import { httpCode, responseMsg, validator, config, encryptPassword } from "../../config/constant"
import HttpException from "../../config/http-error";
import * as jwt from "jsonwebtoken";

/**
 * This function is used to login to application as employee/admin
 * @param req
 * @param res
 */
export const login = async (req: Request, res: Response) => {

    try {
        // Validate login email
        const isValid = await loginValidation(req, res);

        if (isValid) {
            const email = req.body.email;
            const password = req.body.password;

            // encrypting password
            const encryptedPassword = await encryptPassword(password);

            const user: IUser = await User.findOne({
                email,
                password: encryptedPassword
            });


            if (user) {

                // create token to authenticate
                const token = jwt.sign(
                    { userId: user._id, userType: user.userType }, config.jwtSecret,
                    { expiresIn: config.expiresIn }
                );

                res.json(new HttpException(httpCode.success, responseMsg.login_success, { user, token, expiresIn: config.expiresIn }));

            } else {
                // Unknown user
                res.json(new HttpException(httpCode.failure, responseMsg.login_failed_find, null));
            }

        }

    } catch (e) {
        res.json(new HttpException(httpCode.failure, e.message, null));
    }
};

/**
 * This function used to reresh token, if old is expires
 * @param req
 * @param res
 */
export const refreshToken = async (req: Request, res: Response) => {
    try {
        // decode token
        const oldToken = req.headers.auth as string;
        const payload: any = jwt.decode(oldToken);

        // removed unwanted in payload
        delete payload.exp;
        delete payload.iat;

        // recreating new token with old details
        const token = jwt.sign(payload, config.jwtSecret,
            { expiresIn: config.expiresIn }
        );

        res.json(new HttpException(httpCode.success, responseMsg.resfresh_token, { token }));
    }

    catch (e) {
        res.json(new HttpException(httpCode.failure, e.message, null));
    }
}

/**
 * This function used to validate employee object before insertion
 * @param req
 * @param res
 */
async function loginValidation(req: Request, res: Response) {
    if (req.body.email && req.body.password) {

        // Validate email
        const regexp = new RegExp(validator.email_pattern);

        const isValidEmail = regexp.test(req.body.email);

        if (isValidEmail) {
            return true;
        } else {
            res.json(new HttpException(httpCode.failure, responseMsg.email_invalid, null));
        }
    } else {
        res.json(new HttpException(httpCode.failure, responseMsg.login_invalid, null));
    }
}