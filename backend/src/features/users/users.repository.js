import mongoose from "mongoose";
import UserModel from "./users.model.js";
import ApplicationError from "../../error/ApplicationError.js";

export default class UserRepository {
  async createUser(data) {
    try {
      const user = new UserModel(data);
      await user.save();
      return user;
    } catch (error) {
      if (error instanceof mongoose.mongo.MongoServerError) {
        throw new ApplicationError("Email or Phone Already Exist", 406);
      }
      throw error;
    }
  }

  async storeToken(user) {
    try {
      await user.save();
    } catch (error) {
      throw error;
    }
  }
  async getUser(filter) {
    try {
      const user = await UserModel.findOne(filter);
      return user;
    } catch (error) {
      throw error;
    }
  }
}
