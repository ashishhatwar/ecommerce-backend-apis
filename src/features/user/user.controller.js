import UserModel from "./user.model.js ";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import {ApplicationError} from "../../error-handler/applicationError.js";

import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    const { name, email, password, typeOfUser } = req.body;

    console.log(req.body);

    //  validate raw password here (before hashing)
       const passwordRegex = /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be 8–12 characters long and contain at least one special symbol (@$!%*?&)",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const user = new UserModel(name, email, hashedPassword, typeOfUser);

      await this.userRepository.signUp(user);

      res.status(201).send(user);
    } catch (e) {

      next(e);
      // res.status(400).send(e.message);
    }
  }

  async signIn(req, res, next) {
    try {
      //1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);

      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        //2. compare password with hashed password.

        const result = await bcrypt.compare(req.body.password, user.password);

        if (result) {
          // 3. create token

          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "1h",
            }
          );

          // 4. send token

          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (e) {

      next(e);
      res.status(400).send(e.message);
    }
  }

  async resetPassword(req, res, next){

    const {newPassword} = req.body;

    const userID = req.userID;

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    try{

      await this.userRepository.resetPassword(userID, hashedPassword);

      res.status(200).send("Password reset successfully");
    }catch(e){

      console.log(e);

      throw new ApplicationError("Something went wrong with database", 500);

    }


  }

}
