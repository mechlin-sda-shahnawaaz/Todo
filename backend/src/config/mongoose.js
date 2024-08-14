import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log("Database is Connected via Mongoose !!");
  } catch (err) {
    console.log(err);
  }
};

export default connectToDB;
