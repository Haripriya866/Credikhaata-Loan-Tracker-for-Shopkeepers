const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    phone: String,
    address: String,
    trustScore: { type: Number, min: 0, max: 10 },
    creditLimit: Number,
  });
  module.exports = mongoose.model("Customer", customerSchema);