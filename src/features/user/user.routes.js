// import express
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

// Initialize express router

const userRouter = express.Router(); // the goal of this router is to specify your paths that when this path matches, Please call this controller method

// Intenstiate ProductController
const userController = new UserController();

userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});

userRouter.put("/reset-password",jwtAuth, (req, res) => {
  userController.resetPassword(req, res);
});

export default userRouter;
