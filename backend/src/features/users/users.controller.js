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
      const userExist = await this.userRepository.getUserByEmail(email);
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
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
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
}
