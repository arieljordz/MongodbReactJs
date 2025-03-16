const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const PersonModel = require("./models/Person");
const ContentModel = require("./models/Contents");
const QuestionModel = require("./models/Questions");
const AnswerModel = require("./models/Answers");
const ExercisesModel = require("./models/Exercises");

const app = express();
app.use(express.json());
// app.use(cors());

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));

// Connect to MongoDB (local, without authentication)
const mongoURI = "mongodb://127.0.0.1:27017/reactjsmongodb";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to local MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/createPerson", async (req, res) => {
  try {
    const newPerson = await PersonModel.create(req.body);
    res.status(201).json(newPerson);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating person", error: error.message });
  }
});

app.get("/getPersons/all", async (req, res) => {
  try {
    const people = await PersonModel.find();
    res.status(200).json(people);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/updatePerson/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, middlename, lastname, email, userType } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !email?.trim() ||
      !userType?.trim()
    ) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    const updatedPerson = await PersonModel.findByIdAndUpdate(
      id,
      { firstname, middlename, lastname, email, userType },
      { new: true, runValidators: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedPerson);
  } catch (error) {
    console.error("Error updating student:", error);
    res
      .status(500)
      .json({ message: "Error updating student", error: error.message });
  }
});

app.delete("/deletePerson/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const deletedPerson = await PersonModel.findByIdAndDelete(id);

    if (!deletedPerson) {
      return res.status(404).json({ message: "Student not found" });
    }

    res
      .status(200)
      .json({ message: "Student deleted successfully", deletedPerson });
  } catch (error) {
    console.error("Error deleting student:", error);
    res
      .status(500)
      .json({ message: "Error deleting student", error: error.message });
  }
});

app.post("/createContent", async (req, res) => {
  try {
    const newContent = await ContentModel.create(req.body);
    res.status(201).json(newContent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating content", error: error.message });
  }
});

app.get("/getContents/all", async (req, res) => {
  try {
    const contents = await ContentModel.find();
    res.status(200).json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/updateContent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    if (!title?.trim() || !description?.trim()) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    const updatedContent = await ContentModel.findByIdAndUpdate(
      id,
      { title, description, link, category },
      { new: true, runValidators: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json(updatedContent);
  } catch (error) {
    console.error("Error updating content:", error);
    res
      .status(500)
      .json({ message: "Error updating content", error: error.message });
  }
});

app.delete("/deleteContent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    const deletedContent = await ContentModel.findByIdAndDelete(id);

    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    res
      .status(200)
      .json({ message: "Content deleted successfully", deletedContent });
  } catch (error) {
    console.error("Error deleting content:", error);
    res
      .status(500)
      .json({ message: "Error deleting content", error: error.message });
  }
});

app.post("/createQuestionByContent", async (req, res) => {
  try {
    const { question, ...otherData } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ message: "Question field is required." });
    }

    const newQuestion = await QuestionModel.create({ question, ...otherData });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error("Error saving question:", error);
    res
      .status(500)
      .json({ message: "Error saving question", error: error.message });
  }
});

app.get("/getQuestions/all", async (req, res) => {
  try {
    const questions = await QuestionModel.find().populate(
      "contentId",
      "title description link category"
    );

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/getQuestionsBycontentIds", async (req, res) => {
  try {
    let { contentIds } = req.body; // These are actually contentIds

    // Convert contentIds to ObjectId
    const objectIds = contentIds.map((id) => new mongoose.Types.ObjectId(id));

    console.log("Received contentIds:", contentIds);
    console.log("Converted ObjectIds:", objectIds);

    // Query using contentId instead of _id and populate content details
    const questions = await QuestionModel.find({
      contentId: { $in: objectIds },
    }).populate("contentId"); // This assumes contentId is a reference to another collection

    console.log("Fetched Questions with Content Details:", questions);
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions by content IDs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/updateQuestion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let {
      question,
      answerA,
      answerACheck,
      answerB,
      answerBCheck,
      answerC,
      answerCCheck,
      answerD,
      answerDCheck,
      contentId,
    } = req.body;

    console.log("Incoming Update Request:", req.body);
    console.log("ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    if (
      !question?.trim() ||
      !answerA?.trim() ||
      !answerB?.trim() ||
      !answerC?.trim() ||
      !answerD?.trim()
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof contentId === "object" && contentId._id) {
      contentId = contentId._id;
    }

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      console.log("Invalid contentId received:", contentId);
      return res.status(400).json({ message: "Invalid content ID format" });
    }

    contentId = new mongoose.Types.ObjectId(contentId);
    console.log("ContentId converted:", contentId);

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      id,
      {
        question,
        answerA,
        answerACheck,
        answerB,
        answerBCheck,
        answerC,
        answerCCheck,
        answerD,
        answerDCheck,
        contentId,
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res
      .status(500)
      .json({ message: "Error updating question", error: error.message });
  }
});

app.delete("/deleteQuestion/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Question ID" });
    }

    const deletedQuestion = await QuestionModel.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res
      .status(200)
      .json({ message: "Question deleted successfully", deletedQuestion });
  } catch (error) {
    console.error("Error deleting question:", error);
    res
      .status(500)
      .json({ message: "Error deleting question", error: error.message });
  }
});

app.post("/saveAnswerByQuestion", async (req, res) => {
  try {
    const {
      studentId,
      contentId,
      questionId,
      selectedAnswers,
      isCorrect,
      isPartiallyCorrect,
    } = req.body;

    if (!studentId || !contentId || !questionId || !selectedAnswers) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newAnswer = new AnswerModel({
      studentId,
      contentId,
      questionId,
      selectedAnswers,
      isCorrect,
      isPartiallyCorrect,
      dateSubmitted: new Date(),
    });

    await newAnswer.save();
    res
      .status(201)
      .json({ message: "Answer saved successfully", data: newAnswer });
  } catch (error) {
    console.error("Error saving answer:", error);
    res
      .status(500)
      .json({ message: "Error creating answer", error: error.message });
  }
});

app.post("/createExercises", async (req, res) => {
  try {
    const obj = await ExercisesModel.create(req.body);
    res.status(201).json(obj);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating exercises", error: error.message });
  }
});

app.get("/getExercises/all", async (req, res) => {
  try {
    const obj = await ExercisesModel.find();
    res.status(200).json(obj);
  } catch (error) {
    console.error("Error fetching exercises sequence:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/startExercise/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const { sequence, titles, isDone, dateStarted } = req.body;

    // Validate if studentId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId format" });
    }

    // Check if there is an existing exercise with the studentId and isDone=false
    const existingExercise = await ExercisesModel.findOne({
      studentId,
      isDone: false,
    });

    if (existingExercise) {
      // Update the existing exercise if it's not done
      existingExercise.sequence = sequence;
      existingExercise.titles = titles;
      existingExercise.dateStarted = dateStarted;

      const updatedExercise = await existingExercise.save();
      return res.status(200).json(updatedExercise);
    }

    // If student has previous exercises but all are done, create a new one
    const newExercise = new ExercisesModel({
      _id: new mongoose.Types.ObjectId(), // Generate a new _id
      studentId,
      sequence,
      titles,
      isDone,
      dateStarted,
    });

    await newExercise.save();
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error updating or inserting exercise:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/updateExerciseStatus/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate if studentId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId format" });
    }

    // Find and update the exercise where studentId matches and isDone = false
    const updatedExercise = await ExercisesModel.findOneAndUpdate(
      { studentId, isDone: false }, // Filter: Match studentId and isDone = false
      { isDone: true }, // Update: Set isDone to true
      { new: true } // Return updated document
    );

    if (!updatedExercise) {
      return res
        .status(404)
        .json({ message: "No active exercise found to update." });
    }

    res.status(200).json(updatedExercise);
  } catch (error) {
    console.error("Error updating exercise status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getExerciseResults/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId format" });
    }

    // Aggregation to count correct and wrong answers grouped by contentId, then join with Content collection
    const results = await AnswerModel.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
        },
      },
      {
        $group: {
          _id: "$contentId",
          correctCount: { $sum: { $cond: ["$isCorrect", 1, 0] } }, // Count correct answers
          wrongCount: { $sum: { $cond: ["$isCorrect", 0, 1] } }, // Count wrong answers
          totalCount: { $sum: 1 }, // Total count (correct + wrong)
        },
      },
      {
        $lookup: {
          from: "contents", // Name of the content collection in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "contentDetails",
        },
      },
      {
        $unwind: "$contentDetails", // Unwind the content details array to a single object
      },
      {
        $project: {
          _id: 0,
          contentId: "$_id",
          correctCount: 1,
          wrongCount: 1,
          totalCount: 1, // Include total count
          title: "$contentDetails.title",
          description: "$contentDetails.description",
          link: "$contentDetails.link",
          category: "$contentDetails.category",
        },
      },
    ]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for the given studentId." });
    }

    res.status(200).json(results); // Return grouped results with content details
  } catch (error) {
    console.error("Error retrieving answer stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getContentWithQuestions/:contentId", async (req, res) => {
  try {
    const { contentId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: "Invalid contentId format" });
    }

    // Find the content details
    const content = await ContentModel.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Find all questions related to the contentId
    const questions = await QuestionModel.find({ contentId: contentId });

    res.status(200).json({
      title: content.title,
      questions: questions.map((q) => ({
        id: q._id,
        question: q.question,
        answerA: q.answerA,
        answerACheck: q.answerACheck,
        answerB: q.answerB,
        answerBCheck: q.answerBCheck,
        answerC: q.answerC,
        answerCCheck: q.answerCCheck,
        answerD: q.answerD,
        answerDCheck: q.answerDCheck,
      })),
    });
  } catch (error) {
    console.error("Error fetching content and questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/getStudentsAnswer/:contentId/:studentId", async (req, res) => {
  try {
    const { contentId, studentId } = req.params;

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(contentId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid contentId or studentId format" });
    }

    // Find the content details
    const content = await ContentModel.findById(contentId);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Find all questions related to the contentId
    const questions = await QuestionModel.find({ contentId });

    // Fetch student's answers for the given contentId
    const studentAnswers = await AnswerModel.find({ contentId, studentId });

    // Map questions to include student's answer
    const formattedQuestions = questions.map((q) => {
      // Find the student's answer for this question
      const studentAnswer = studentAnswers.find((ans) => ans.questionId.toString() === q._id.toString());

      return {
        id: q._id,
        question: q.question,
        answerA: q.answerA,
        answerACheck: q.answerACheck,
        answerB: q.answerB,
        answerBCheck: q.answerBCheck,
        answerC: q.answerC,
        answerCCheck: q.answerCCheck,
        answerD: q.answerD,
        answerDCheck: q.answerDCheck,
        studentSelectedAnswers: studentAnswer ? studentAnswer.selectedAnswers : null, // Student's selected answers
        isCorrect: studentAnswer ? studentAnswer.isCorrect : null, // Whether the student got it right
        isPartiallyCorrect: studentAnswer ? studentAnswer.isPartiallyCorrect : null, // Partial correctness
      };
    });

    res.status(200).json({
      title: content.title,
      questions: formattedQuestions,
    });
  } catch (error) {
    console.error("Error fetching content, questions, and student answers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});




// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
