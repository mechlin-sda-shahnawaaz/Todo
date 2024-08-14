import ApplicationError from "../error/ApplicationError.js";
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const headers = req.headers;
    const authHeader = headers["authorization"];
    if (!authHeader) {
      throw new ApplicationError("UnAuthorized Access", 401);
    }
    const { id } = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.userId = id;
    next();
  } catch (error) {
    next(error);
  }
};
export default jwtAuth;
