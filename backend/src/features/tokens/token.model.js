import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  refreshToken: { type: String, required: true },
  createdAt: {
    type: Date,
    default: new Date(),
    expires: 60 * 60 * 24 * 30,
  },
});

const TokenModel = mongoose.model("Token", tokenSchema);
export default TokenModel;
