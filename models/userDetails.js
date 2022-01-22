const mongoose = require("mongoose");

const userDetails = mongoose.model("userDetails", {
  name: {
    type: String,
    default: "gfg",
  },
});

module.exports = userDetails;
