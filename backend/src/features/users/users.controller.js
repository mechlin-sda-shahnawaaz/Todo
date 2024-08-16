import ApplicationError from "../../error/ApplicationError.js";
import UserRepository from "./users.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateTokens } from "../../utils/generateTokens.js";
import TokenModel from "../tokens/token.model.js";
export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new ApplicationError("All field Must be Present !!", 406);
      }
      const userExist = await this.userRepository.getUser({ email });
      if (!userExist) {
        throw new ApplicationError("User with this Email not Exist !!", 404);
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        userExist.password
      );
      if (!isPasswordCorrect) {
        throw new ApplicationError("Incorrect Password", 401);
      }

      const { accessToken, refreshToken } = await generateTokens(userExist);
      userExist.token = refreshToken;
      await this.userRepository.storeToken(userExist);
      return res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  }

  async signUp(req, res, next) {
    try {
      console.log(req.body);
      let { name, password, email, phone, age } = req.body;
      if (!name || !password || !email || !phone || !age) {
        throw new ApplicationError("All fields Must be Present !!", 406);
      }

      password = await bcrypt.hash(password, 12);

      const user = await this.userRepository.createUser({
        name,
        email,
        phone,
        password,
        age,
      });
      return res.status(201).json({ success: true, user });
    } catch (error) {
      next(error);
    }
  }

  async verifyRefreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new ApplicationError("Refresh Token not Present", 406);
      }

      const user = await TokenModel.findOne({ refreshToken });
      if (!user) {
        throw new ApplicationError("Invalid RefreshToken", 401);
      }

      const { _id } = jwt.verify(
        user.refreshToken,
        process.env.REFRESH_TOKEN_SECRET_KEY
      );
      req._id = _id;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new ApplicationError("Invalid RefreshToken", 406);
      }
      next(error);
    }
  }
}
