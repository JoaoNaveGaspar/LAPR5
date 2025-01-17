import { IUserPersistence } from '../../dataschema/IUserPersistence';
import mongoose from 'mongoose';

const User = new mongoose.Schema(
  {
    domainId: { 
      type: String,
      unique: true
    },

    firstName: {
      type: String,
      required: [true, 'Please enter first name'],
      index: true,
    },

    lastName: {
      type: String,
      required: [true, 'Please enter last name'],
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      unique: false,
      index: true,
    },

    role: {
      type: String,
      default: 'user',
    },

    phoneNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUserPersistence & mongoose.Document>('User', User);
