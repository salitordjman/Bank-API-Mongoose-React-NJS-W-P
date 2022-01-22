const express = require("express");
require("./db/mongoose");
const userDetails = require("./models/userDetails");

//
const cors = require("cors");
const path = require("path");
//

const app = express();

const port = process.env.PORT || 5000;

//
const publicPath = path.join(__dirname, "client/build");
app.use(cors());
app.use(express.static(publicPath));
//
app.use(express.json());

app.get("/api/users", async (req, res) => {
  try {
    const myUser = await userDetails.find({});
    res.status(200).send(myUser);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
app.get("/api/users/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const myUser = await userDetails.findById(_id);
    if (!myUser) {
      return res.status(404).send();
    }

    res.send(myUser);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.post("/api/users", async (req, res) => {
  const newUser = new userDetails(req.body);
  try {
    await newUser.save();
    res.status(201).send(newUser);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

app.patch("/api/users/deposit/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const money = req.body.deposit;
    if (typeof money === "number" && money > 0) {
      const userDeposit = await userDetails.findById(_id);
      if (!userDeposit) {
        return res.status(404).send("Not found user");
      }
      userDeposit.cash += money;
      userDeposit.save();
      res.status(200).send(userDeposit);
    } else {
      res.status(401).send("Deposit must be a positive number");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//
app.get("*", (req, res) => {
  res.sendFile(path.resolve(publicPath, "index.html"));
});
//

app.listen(port, () => {
  console.log("listening on port " + port);
});
