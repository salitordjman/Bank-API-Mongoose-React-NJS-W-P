const express = require("express");
require("./db/mongoose");
const Product = require("./models/products");

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

// app.get("/api/users", (req, res) => {
//   try {
//     res.status(200).send({ userName: "Bob" });
//   } catch (e) {
//     res.status(400).send({ error: e.message });
//   }
// });

app.get("/api/users", async (req, res) => {
  try {
    const prod = await Product.find({});
    res.status(200).send(prod);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

app.post("/api/users", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    await newProduct.save();
    res.status(201).send(newProduct);
  } catch (e) {
    res.status(400).send(e);
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
