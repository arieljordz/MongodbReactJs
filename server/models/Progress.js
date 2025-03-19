const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
  category: String,
  timeLeft: Number,
  isDone: Boolean,
  isRetake: Boolean,
  progress: [
    {
      contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Contents" },
      currentQuestionIndex: Number,
      answeredQuestions: [
        {
          questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Questions" }, // ✅ Ensure reference
          selectedAnswers: [String],
          isCorrect: Boolean,
          isPartiallyCorrect: Boolean,
          isDone: Boolean,
        },
      ],
    },
  ],
});

const ProgressModel = mongoose.model("Progress", ProgressSchema);
module.exports = ProgressModel;
