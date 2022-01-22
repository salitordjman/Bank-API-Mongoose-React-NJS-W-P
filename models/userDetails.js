const mongoose = require("mongoose");

const detailsSchema = mongoose.Schema({
  passportId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 7,
    maxLength: 10,
  },
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
  details: detailsSchema,
});

module.exports = userDetails;
