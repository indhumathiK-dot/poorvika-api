import * as express from "express";
import * as constant from "../config/constant"
import { checkJwt, checkRole } from "../middleware/autherization";
import * as emploeeControler from "./employee/employee.controller"
import * as userController from "./auth/user.controller"

export const register = (app: express.Application) => {

    // default API
    app.get(constant.routerPath.home, async (req: any, res) => {
        res.send("Welcome to poorvika employee management. Pass /api to get APIs");
    });

    // login API
    app.post(constant.routerPath.login, userController.login);

    // create employee
    app.post(constant.routerPath.employeeAdd, [checkJwt, checkRole([constant.config.adminUserType])], emploeeControler.addEmployee)

    // get details of employee
    app.get(constant.routerPath.employeeDetail, [checkJwt], emploeeControler.detailEmployee)

    // List of employees
    app.get(constant.routerPath.employeeList, [checkJwt, checkRole([constant.config.adminUserType])], emploeeControler.allEmployee)

    // Update employee
    app.put(constant.routerPath.employeeUpdate, [checkJwt, checkRole([constant.config.adminUserType])], emploeeControler.updateEmployee)

    // delete employee
    app.delete(constant.routerPath.employeeDelete, [checkJwt, checkRole([constant.config.adminUserType])], emploeeControler.deleteEmployee)

    // refresh old token
    app.get(constant.routerPath.refreshToken, userController.refreshToken);
};