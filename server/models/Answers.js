const mongoose = require("mongoose");

// Define Schema
const AnswerSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    selectedAnswers: { type: Object, required: true }, 
    isCorrect: { type: Boolean },
    isPartiallyCorrect: { type: Boolean },
    dateSubmitted: { type: Date, default: Date.now }
});

const AnswerModel = mongoose.model("Answers", AnswerSchema);
module.exports = AnswerModel;
