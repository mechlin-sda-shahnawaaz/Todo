import ApplicationError from "../../error/ApplicationError.js";
import UserRepository from "./users.repository.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
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
      const token = jwt.sign(
        { email: userExist.email, id: userExist._id },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "1d" }
      );

      userExist.token = token;
      await this.userRepository.storeToken(userExist);
      return res.status(200).json({
        success: true,
        token,
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

  async refreshToken(req, res, next) {
    try {
      const headers = req.headers;
      const authHeader = headers["authorization"];
      if (!authHeader) {
        throw new ApplicationError("UnAuthorized Access", 401);
      }
      const { id: _id } = jwt.verify(
        authHeader,
        process.env.ACCESS_TOKEN_SECRET_KEY
      );

      if (!_id) {
        throw new ApplicationError("Unauthorized Access", 401);
      }
      const user = await this.userRepository.getUser({ _id });

      if (!user || user.token != authHeader) {
        throw new ApplicationError("Unauthorized Access", 401);
      }

      const newToken = jwt.sign(
        { email: user.email, _id },
        process.env.ACCESS_TOKEN_SECRET_KEY
      );
      res.status(200).json({ success: true, token: newToken });
    } catch (error) {
      next(error);
    }
  }
}
