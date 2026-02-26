const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    telegramId: {
      type: Number,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Admin", AdminSchema);
