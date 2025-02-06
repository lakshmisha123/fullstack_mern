const express = require("express");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();
var cors = require("cors");

app.use(cors());
app.use(express.json());

const connectDB = require("./db/connect");
const authRouter = require("./routes/auth");
app.use("/api", authRouter);

//Port and Connect to DB
const port = process.env.PORT || 5003;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
      console.log("error =>", error);
  }
};
start();