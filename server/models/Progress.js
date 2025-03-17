const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contents",
    required: true,
  },
  selectedAnswers: { type: [String], required: true },
  isCorrect: { type: Boolean, required: true },
  isPartiallyCorrect: { type: Boolean, required: true },
  isDone: { type: Boolean, required: true, default: false },
});

const ContentProgressSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contents",
    required: true,
  },
  currentQuestionIndex: { type: Number, required: true, default: 0 },
  answeredQuestions: { type: [AnswerSchema], default: [] },
});

const ProgressSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
  progress: { type: [ContentProgressSchema], default: [] },
  category: { type: String, required: true },
  timeLeft: { type: Number, default: 0 },
  isDone: { type: Boolean, required: true, default: false },
  lastUpdated: { type: Date, default: Date.now },
});

const ProgressModel = mongoose.model("Progress", ProgressSchema);
module.exports = ProgressModel;
