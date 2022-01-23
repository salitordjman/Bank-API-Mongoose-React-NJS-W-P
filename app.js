const express = require("express");
require("./db/mongoose");
const userDetails = require("./models/userDetails");

const cors = require("cors");
const path = require("path");

const app = express();

const port = process.env.PORT || 5000;

const publicPath = path.join(__dirname, "client/build");
app.use(cors());
app.use(express.static(publicPath));
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
    if (req.body.deposit > 0) {
      const prod = await userDetails.findByIdAndUpdate(
        req.params.id,
        { $inc: { cash: req.body.deposit } },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!prod) {
        return res.status(404).send();
      }
      res.send(prod);
    } else {
      res.status(401).send("Deposit must be a positive number");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.patch("/api/users/credit/:id", async (req, res) => {
  try {
    const prod = await userDetails.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!prod) {
      return res.status(404).send();
    }
    res.send(prod);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.patch("/api/users/withdraw/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const money = req.body.withdraw;
    if (typeof money === "number" && money > 0) {
      const userWithdraw = await userDetails.findById(_id);
      if (!userWithdraw) {
        return res.status(404).send("Not found user");
      }
      if (money > userWithdraw.cash + userWithdraw.credit) {
        if (userWithdraw.cash > 0 || userWithdraw.credit > 0) {
          const withdraw = userWithdraw.cash + userWithdraw.credit;
          userWithdraw.cash = 0;
          userWithdraw.credit = 0;
          userWithdraw.save();
          return res
            .status(205)
            .send(`The user can withdraw only ${withdraw}` + userWithdraw);
        } else {
          return res.status(401).send("The user can't withdraw" + userWithdraw);
        }
      } else if (money > userWithdraw.cash) {
        userWithdraw.credit += -money + userWithdraw.cash;
        userWithdraw.cash = 0;
      } else {
        userWithdraw.cash -= money;
      }
      userWithdraw.save();
      res.status(200).send(userWithdraw);
    } else {
      res.status(401).send("Withdraw must be a positive number");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.patch("/api/users/transferring/:id", async (req, res) => {
  try {
    const _idFrom = req.params.id;
    const _idTo = req.body.toID;
    const money = req.body.transferring;
    if (typeof money === "number" && money > 0) {
      const userFrom = await userDetails.findById(_idFrom);
      const userTo = await userDetails.findById(_idTo);
      if (!userFrom || !userTo) {
        return res.status(404).send("Not found user");
      }
      if (money > userFrom.cash + userFrom.credit) {
        if (userFrom.cash > 0 || userFrom.credit > 0) {
          const transfer = userFrom.cash + userFrom.credit;
          userFrom.cash = 0;
          userFrom.credit = 0;
          userTo.cash += transfer;
          userFrom.save();
          userTo.save();
          return res
            .status(205)
            .send(
              `The user can transferring only ${transfer}` + userFrom + userTo
            );
        } else {
          return res
            .status(401)
            .send("The user can't transferring" + userFrom + userTo);
        }
      } else if (money > userFrom.cash) {
        userFrom.credit += -money + userFrom.cash;
        userFrom.cash = 0;
      } else {
        userFrom.cash -= money;
      }
      userTo.cash += money;
      userFrom.save();
      userTo.save();
      res.status(200).send("Transferring success" + userFrom + userTo);
    } else {
      res.status(401).send("Transferring must be a positive number");
    }
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve(publicPath, "index.html"));
});

app.listen(port, () => {
  console.log("listening on port " + port);
});
