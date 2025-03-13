const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const ContentModel = require("./models/Contents");
const QuestionModel = require("./models/Questions");

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

// Create (Add) Content
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

// Read (Get All) Contents
app.get("/getContents/all", async (req, res) => {
  try {
    const contents = await ContentModel.find();
    res.status(200).json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update (By Id) Contents
app.put("/updateContent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, category } = req.body;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid content ID" });
    }

    // Validate required fields
    if (!title?.trim() || !description?.trim()) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    const updatedContent = await ContentModel.findByIdAndUpdate(
      id,
      { title, description, link, category }, // Update all fields
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

// Delete Content by ID
app.delete("/deleteContent/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
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
    // console.log("Received Data:", req.body);
    const newQuestion = await QuestionModel.create(req.body);
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
    const questions = await QuestionModel.find().populate("contentId", "title");
    res.status(200).json(questions);
    // console.log("From API :", questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/updateQuestion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { question, answerA, answerACheck, answerB, answerBCheck, answerC, answerCCheck, answerD, answerDCheck, contentId } = req.body;

    console.log("Incoming Update Request:", req.body);
    console.log("ID:", id);

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question ID" });
    }

    // Validate required fields (excluding contentId)
    if (!question?.trim() || !answerA?.trim() || !answerB?.trim() || !answerC?.trim() || !answerD?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Extract `_id` if `contentId` is an object
    if (typeof contentId === "object" && contentId._id) {
      contentId = contentId._id;
    }

    // Validate `contentId`
    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      console.log("Invalid contentId received:", contentId);
      return res.status(400).json({ message: "Invalid content ID format" });
    }

    // Convert `contentId` to ObjectId
    contentId = new mongoose.Types.ObjectId(contentId);
    console.log("ContentId converted:", contentId);

    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      id,
      { question, answerA, answerACheck, answerB, answerBCheck, answerC, answerCCheck, answerD, answerDCheck, contentId },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
});

app.delete("/deleteQuestion/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
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

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
