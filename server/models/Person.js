const mongoose = require("mongoose");

// Define Schema
const PersonSchema = new mongoose.Schema({
  firstname: String,
  middlename: String,
  lastname: String,
  email: String,
  userType: String,
  dateAdded: { type: Date, default: Date.now },
});

const PersonModel = mongoose.model("Person", PersonSchema);
module.exports = PersonModel;
