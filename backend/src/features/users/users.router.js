import express from "express";
import UserController from "./users.controller.js";
import { regenerateToken } from "../../utils/generateTokens.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});

userRouter.post("/signin", (req, res, next) => {
  userController.signIn(req, res, next);
});

userRouter.post(
  "/refresh-token",
  (req, res, next) => {
    userController.verifyRefreshToken(req, res, next);
  },
  regenerateToken
);

export default userRouter;
