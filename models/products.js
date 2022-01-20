const mongoose = require("mongoose");

const Product = mongoose.model("Product", {
  name: {
    type: String,
    default: "gfg",
  },
});

module.exports = Product;
