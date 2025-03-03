const mongoose = require("mongoose");

// Define Schema
const ContentSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String,
    category:String
});

const ContentModel = mongoose.model("Contents", ContentSchema);
module.exports = ContentModel;