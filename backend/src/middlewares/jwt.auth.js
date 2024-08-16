import ApplicationError from "../error/ApplicationError.js";
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  try {
    const headers = req.headers;
    const authHeader = headers["authorization"];
    if (!authHeader) {
      throw new ApplicationError("UnAuthorized Access", 401);
    }
    const { _id } = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.userId = _id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApplicationError("Token Expired", 400);
    }
    next(error);
  }
};
export default jwtAuth;
