import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

// Creating Model from schema
const UserModel = mongoose.model("users", userSchema);

export default class UserRepository {
  async signUp(user) {
    try {
      // create instance of model.

      const newUser = new UserModel(user);

      await newUser.save();
      return newUser;
    } catch (err) {
      console.log(err);

      if(err instanceof mongoose.Error.ValidationError) {
        throw new ApplicationError(err.message, 400);
      }else{

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (err) {
      console.log(err);

      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (e) {
      console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async resetPassword(userID, newPassword) {
    try {
      let user = await UserModel.findById(userID);

      if (user) {
        user.password = newPassword;
        await user.save();
        return user;
      } else {
        throw new Error("User not found");
      }
    } catch (e) {
      console.log(e);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}
