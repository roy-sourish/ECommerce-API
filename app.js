const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("express-async-errors");
require("dotenv").config();

const connectDB = require("./db/connect");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("ECommerce-API");
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    const conn = await connectDB(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
