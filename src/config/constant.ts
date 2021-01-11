import * as crypto from "crypto";

/**
 * Basic API response message
 */
export const responseMsg = {
    login_success: 'Login Successfully',
    resfresh_token: 'Token Refreshed Successfully',
    expire_token: 'Token Expired',
    login_failed: 'Unable To Login Application',
    login_failed_find: 'Unable To Find You In Application',
    login_invalid: 'Please Enter Email/Password',
    email_invalid: 'Please Enter Valid Email',
    unknown_error: 'Please Contact Administartor',
    unauthorizer_user: 'Malformed User',
    employee_requied: 'Please Fill Required Details',
    employee_date_validator: 'Please Enter IN YYYY-mm-dd Format',
    employee_id_required: 'Please enter User id',
    employee_add_success: 'Employee Created Successfully',
    employee_update_success: 'Employee Updated Successfully',
    employee_delete_success: 'Employee Deleted Successfully',
    employee_details_success: 'Employee Fetched Successfully',
    employee_add_failure: 'Unable To Create Employee With Same Email',
    employee_add_valid_failure: 'You Have No Permission To Create Employee',
    employee_update_failure: 'Unable To Find Employee To Update',
    employee_delete_failure: 'Unable To Details Employee',
    employee_details_failure: 'Unable To get Employee',
    permission_error: 'You Don\'t Have Permission For This Process',
    unexpected_error: 'It\'s not you. It\'s us. We are having some problems.'
}

/**
 * Employee creation regex validator
 */
export const validator = {
    email_pattern: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,5})$",
    date_pattern: "^\\d{4}\\-(0?[1-9]|1[012])\\-(0?[1-9]|[12][0-9]|3[01])$"
}

/**
 * Root of API call path
 */
export const API_URL = '/api';

/**
 * All API routing paths
 */
export const routerPath = {
    home: '/',
    login: API_URL + '/login',
    employeeList: API_URL + '/employee/list',
    employeeAdd: API_URL + '/employee/add',
    employeeUpdate: API_URL + '/employee/update',
    employeeDelete: API_URL + '/employee/delete/:id',
    employeeDetail: API_URL + '/employee/detail/:id',
    refreshToken: API_URL + '/refreshToken'
}

/**
 * Secret keys of application
 */
export const config = {
    jwtSecret: 'poorvika987159',
    expiresIn: '1h',
    token: 'token',
    encryptionKey : 'I206Pnpoorvika21kXn25',
    encryptionHash: 'sha512',
    encryptionHex: 'hex',
    adminUserType: 1,
    token_expired: 'TokenExpiredError',
}

/**
 * http status code used in application
 */
export const httpCode = {
    created: 201,
    success: 200,
    failure: 400,
    unauthorized: 401,
    noPermission: 403,
    expiredToken: 402,
    internalError: 500
}

/**
 * Employee designation enum
 */
export const employeeDesignation = [
    "Trainee",
    "Telecom Information Specialist",
    "Chief Sales Manager",
    "Human Resources Manager",
    "Telecom Associate",
    "Engineering Analyst",
    "Team Leader",
]

/**
 * Encrypt the password
 * @param password
 */
export async function encryptPassword(password:string) {
    if (password) {
        const hash = crypto.createHash(config.encryptionHash);
        hash.update(password + config.encryptionKey);
        const value = hash.digest('hex');
        return value;
    } else {
        return null;
    }
}