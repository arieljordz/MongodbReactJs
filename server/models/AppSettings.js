const mongoose = require("mongoose");

// Define Schema
const AppSettingsSchema = new mongoose.Schema({
  timeDuration: String,
  appName: String,
  navColor: String,
  isEnabled: { type: Boolean },
  dateAdded: { type: Date, default: Date.now },
});

const AppSettingsModel = mongoose.model("AppSettings", AppSettingsSchema);
module.exports = AppSettingsModel;
