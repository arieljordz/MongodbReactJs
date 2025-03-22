const mongoose = require("mongoose");

// Define Schema
const CategorySchema = new mongoose.Schema({
  description: String,
  isActive: { type: Boolean },
});

const CategoryModel = mongoose.model("Category", CategorySchema);
module.exports = CategoryModel;
