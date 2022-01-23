const mongoose = require("mongoose");

const detailsSchema = mongoose.Schema({
  DateAdded: {
    type: Date,
    default: Date(),
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});
const userDetails = mongoose.model("userDetails", {
  name: {
    type: String,
    required: true,
    minLength: 2,
  },
  cash: {
    type: Number,
    default: 0,
    min: 0,
  },
  credit: {
    type: Number,
    default: 0,
    min: 0,
  },
  passportId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 7,
    maxLength: 10,
  },
  details: detailsSchema,
});

module.exports = userDetails;
