import app from "./index.js";
import connectToDB from "./src/config/mongoose.js";
app.listen(4000, (e) => {
  if (e) {
    console.log(e);
    return;
  }
  console.log("Server is Up and Run on Port 4000");
  connectToDB();
});
