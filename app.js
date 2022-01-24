const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");

const cors = require("cors");
const path = require("path");

const app = express();

const publicPath = path.join(__dirname, "client/build");
app.use(cors());
app.use(express.static(publicPath));
app.use(express.json());
app.use(userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(publicPath, "index.html"));
});

module.exports = app;
