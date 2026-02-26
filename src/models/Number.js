const mongoose = require("mongoose");

const NumberSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Number", NumberSchema);
