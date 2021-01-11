import { model, Schema, Model, Document } from 'mongoose';
import { employeeDesignation } from '../config/constant';

/**
 * This interface used to do CURD operation with employee
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  designation: string;
  dateOfBirth: string;
  dateOfJoining: string;
  userType: number;
  createdBy: string;
}

/**
 * Employee schema
 */
const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  designation: { type: String, enum : employeeDesignation, default: employeeDesignation[0], required: false },
  dateOfBirth: { type: String, required: false },
  dateOfJoining: { type: String, required: true },
  userType: { type: Number, required: true, default: 2 },
  createdBy: { type: String, required: true }
});

export const User: Model<IUser> = model('employees', UserSchema);