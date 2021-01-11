import { IUser, User } from "../../models/employee"
import { Request, Response } from "express";
import { config, encryptPassword, httpCode, responseMsg, validator } from "../../config/constant"
import HttpException from "../../config/http-error";

/**
 * This function used to list of employees with pagination, search in desc order
 * @param req
 * @param res
 */
export const allEmployee = async (req: Request, res: Response) => {
  try {
    let user: IUser[];
    let userCount: number;
    const findObject = { createdBy: res.locals.jwtPayload.userId };

    // with pagianation
    if (req.query.pagintionStart && req.query.pagintionLimit) {

      const search = { $regex: '.*' + req.query.search + '.*' };

      if (req.query.search) {
        const findObjectWithSearch = { $and: [
          { $or: [{lastName: search}, {firstName: search}] },
          {createdBy: res.locals.jwtPayload.userId}
        ]};

        // employee list with search
        user = await User.find(findObjectWithSearch)
        .skip(Number(req.query.pagintionStart))
        .limit(Number(req.query.pagintionLimit)).sort({_id: 'desc'});

        // employee count with search
        userCount = await User.find(findObjectWithSearch).countDocuments();
      } else {

        // employee list without search
        user = await User.find(findObject).skip(Number(req.query.pagintionStart))
        .limit(Number(req.query.pagintionLimit)).sort({_id: 'desc'});

        // employee count without search
        userCount = await User.find(findObject).countDocuments();
      }

    } else {
      if (req.query.search) {
        const search = { $regex: '.*' + req.query.search + '.*' };
        const findObjectWithSearch = { $and: [
          { $or: [{lastName: search}, {firstName: search}] },
          {createdBy: res.locals.jwtPayload.userId}
        ]};

        // employee list with search
        user = await User.find(findObjectWithSearch)
        .skip(Number(req.query.pagintionStart))
        .limit(Number(req.query.pagintionLimit)).sort({_id: 'desc'});

        // count with search
        userCount = await User.find(findObjectWithSearch).countDocuments();

      } else {
        user = await User.find(findObject);
        userCount = user.length;
      }

    }

    res.json(new HttpException(httpCode.success, responseMsg.employee_details_success, {list: user, count: userCount}));

  } catch (e) {
    res.json(new HttpException(httpCode.failure, e.message, null));
  }
};


/**
 * This function used to create new employee
 * @param req
 * @param res
 */
export const addEmployee = async (req: Request, res: Response) => {
  try {

    const employeeDetails = await employeeValidation(req, res);

    if (employeeDetails) {
      const isExitingUser: IUser[] = await User.find({ email: employeeDetails.email });

      // Admin only can create employee
      if (res.locals.jwtPayload.userType !== 1) {
        res.json(new HttpException(httpCode.failure, responseMsg.employee_add_valid_failure, null));

      } else if (isExitingUser && isExitingUser.length) {

        // cannot add employee with same email
        res.json(new HttpException(httpCode.failure, responseMsg.employee_add_failure, null));

      } else {
        const user: IUser = await User.create(employeeDetails);

        res.json(new HttpException(httpCode.success, responseMsg.employee_add_success, user));

      }
    }


  } catch (e) {
    res.json(new HttpException(httpCode.failure, e.message, null));
  }
};

/**
 * This function used for updating existing employee
 * @param req
 * @param res
 */
export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (req.body.userId) {
      // check employee exist
      const user: IUser = await User.findOne({ _id: data.userId });

      if (user) {
        const employeeUpdateObject = {
          email: data.email ? data.email : user.email,
          firstName: data.firstName ? data.firstName : user.firstName,
          lastName: data.lastName ? data.lastName : user.lastName,
          designation: data.designation ? data.designation : user.designation,
          dateOfJoining: data.dateOfJoining ? data.dateOfJoining : user.dateOfJoining,
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth : user.dateOfBirth,
        }
        const userUpdate: IUser = await User.updateOne({ _id: req.body.userId }, employeeUpdateObject);

        res.json(new HttpException(httpCode.success, responseMsg.employee_update_success, employeeUpdateObject));
      } else {
        res.json(new HttpException(httpCode.failure, responseMsg.employee_update_failure, user));
      }

    } else {
      res.json(new HttpException(httpCode.failure, responseMsg.employee_id_required, null));
    }

  } catch (e) {
    res.json(new HttpException(httpCode.failure, e.message, null));
  }
};

/**
 * This function used to get employee details with particular id
 * @param req
 * @param res
 */
export const detailEmployee = async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findOne({ _id: req.params.id, createdBy: res.locals.jwtPayload.userId });

    res.json(new HttpException(httpCode.success, responseMsg.employee_details_success, user));

  } catch (e) {
    res.json(new HttpException(httpCode.failure, e.message, null));
  }
};

/**
 * This function used to delete employee with id
 * @param req
 * @param res
 */
export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const user: IUser = await User.findOneAndDelete({ _id: req.params.id });

    res.json(new HttpException(httpCode.success, responseMsg.employee_delete_success, user));

  } catch (e) {
    res.json(new HttpException(httpCode.failure, e.message, null));
  }
};

/**
 * This function used for validating employee required fields
 * @param req
 * @param res
 */
async function employeeValidation(req: Request, res: Response) {

  const employeeObject = req.body;

  if (employeeObject.firstName && employeeObject.lastName &&
     employeeObject.password && employeeObject.email &&
     employeeObject.dateOfJoining && employeeObject.designation) {

      // Adding date validator for date fields
      const employeeDateTest = new RegExp(validator.date_pattern);
      let isValidDate = true;

      if (!(employeeDateTest.test(employeeObject.dateOfJoining))) {
        isValidDate = false;
        res.json(new HttpException(httpCode.failure, responseMsg.employee_date_validator, null))
      }

      if (isValidDate && employeeObject.dateOfBirth && !(employeeDateTest.test(employeeObject.dateOfBirth))) {
        isValidDate = false;
        res.json(new HttpException(httpCode.failure, responseMsg.employee_date_validator, null))
      }

      // validate to add employee
      if (isValidDate) {
        const encryptedPassword = await encryptPassword(employeeObject.password);

        employeeObject.userType = 2;
        employeeObject.password = encryptedPassword;
        employeeObject.createdBy = res.locals.jwtPayload.userId

        return employeeObject;
      }

  } else {
    res.json(new HttpException(httpCode.failure, responseMsg.employee_requied, null))
  }
}