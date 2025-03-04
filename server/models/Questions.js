const mongoose = require("mongoose");

// Define Schema
const QuestionSchema = new mongoose.Schema({
  question: String,
  answerA: String,
  answerACheck: Boolean,
  answerB: String,
  answerBCheck: Boolean,
  answerC: String,
  answerCCheck: Boolean,
  answerD: String,
  answerDCheck: Boolean,
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contents", 
    required: true
  }
});

const QuestionModel = mongoose.model("Questions", QuestionSchema);
module.exports = QuestionModel;
