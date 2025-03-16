const mongoose = require("mongoose");

// Define Schema
const ExercisesSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Person",
    required: true,
  },
  sequence: String,
  titles: String,
  isDone: { type: Boolean },
  dateStarted: { type: Date, default: Date.now },
});

const ExercisesModel = mongoose.model("Exercises", ExercisesSchema);
module.exports = ExercisesModel;
