import jwt from "jsonwebtoken";
import TokenModel from "../features/tokens/token.model.js";

const { ACCESS_TOKEN_SECRET_KEY, REFRESH_TOKEN_SECRET_KEY } = process.env;
export const generateTokens = async (user) => {
  const payload = { _id: user._id };
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: "30d",
  });
  await TokenModel.deleteOne({ userId: user._id });
  await new TokenModel({ userId: user._id, refreshToken }).save();
  return { accessToken, refreshToken };
};

export const regenerateToken = (req, res, next) => {
  try {
    const { _id } = req;
    const token = jwt.sign({ _id }, ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: "1m",
    });
    return res.status(200).json({ success: true, accessToken: token });
  } catch (error) {
    next(error);
  }
};
