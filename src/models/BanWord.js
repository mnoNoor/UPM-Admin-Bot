const mongoose = require("mongoose");

const BanWordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = mongoose.model("BanWord", BanWordSchema);
