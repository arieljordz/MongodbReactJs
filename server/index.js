const WebSocket = require("ws");
const url = require("url");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");
const PersonModel = require("./models/Person");
const ContentModel = require("./models/Contents");
const QuestionModel = require("./models/Questions");
const ProgressModel = require("./models/Progress");
const AppSettingsModel = require("./models/AppSettings");
const CategoryModel = require("./models/Category");
const wss = new WebSocket.Server({ port: 8080 }); // Run WebSocket on port 8080

const app = express();
app.use(express.json());
// app.use(cors());

const corsOptions = {
  // origin: "http://localhost:5173",
  origin: "https://mongodb-react-js.vercel.app/",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type",
};

app.use(cors(corsOptions));

// Connect to MongoDB (local, without authentication)
// const mongoURI = "mongodb://127.0.0.1:27017/reactjsmongodb";
const mongoURI =
  "mongodb+srv://arieljordz:nyUVHL1LQR8gPYj2@cluster0.7fotz.mongodb.net/mongodb_reactjs?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to local MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 
app.get("/", (req, res) => {
  res.send("Server is running!");
});

wss.on("connection", async (ws, req) => {
  const queryParams = url.parse(req.url, true).query;
  const progressId = queryParams.progressId;

  if (!progressId) {
    ws.close();
    return;
  }

  console.log(`Client connected: Student ID = ${progressId}`);

  let progress = await ProgressModel.findOne({ _id: progressId });

  console.log("progress timeLeft:", progress?.timeLeft);
  let timeLeft = progress?.timeLeft ?? 0; // ✅ Get saved timeLeft or default to 600

  ws.send(JSON.stringify({ timeLeft })); // ✅ Send latest timeLeft to client on connect

  // Countdown logic (update DB every 10s to reduce load)
  const interval = setInterval(async () => {
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    timeLeft--;

    // Send updated timeLeft to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ timeLeft }));
      }
    });

    // Save timeLeft to database every 10 seconds
    if (timeLeft % 2 === 0) {
      await ProgressModel.updateOne({ _id: progressId }, { timeLeft });
    }
  }, 1000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

// Person End Points
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

// Content End Points
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

// Question End Points
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

// Route to save or update AppSettings
app.post("/saveAppSettings", async (req, res) => {
  try {
    const { timeDuration, appName, isEnabled } = req.body;

    // console.log("appName:", appName);

    const existingSettings = await AppSettingsModel.findOne();

    if (existingSettings) {
      // Update existing settings
      existingSettings.timeDuration = timeDuration;
      existingSettings.appName = appName;
      existingSettings.isEnabled = isEnabled;
      await existingSettings.save();
      return res
        .status(200)
        .json({ message: "Settings updated", existingSettings });
    } else {
      // Create new settings if none exist
      const newSettings = await AppSettingsModel.create({
        timeDuration,
        appName,
        isEnabled,
      });
      return res.status(201).json({ message: "Settings created", newSettings });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving settings", error: error.message });
  }
});

app.get("/getAppSettings", async (req, res) => {
  try {
    const settings = await AppSettingsModel.findOne();

    if (settings) {
      return res.status(200).json(settings);
    } else {
      return res.status(404).json({ message: "No settings found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving settings", error: error.message });
  }
});

// ✅ Create new progress
app.post("/createProgress", async (req, res) => {
  try {
    const { studentId, category } = req.body;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Ensure student exists
    const student = await PersonModel.findById(studentObjectId);
    if (!student)
      return res.status(404).json({ message: "Student not found." });

    // Check if progress already exists
    let progress = await ProgressModel.findOne({
      studentId: studentObjectId,
      category,
      isDone: false,
    })
      .populate("studentId", "firstname middlename lastname email")
      .populate({ path: "progress.contentId", model: "Contents" })
      .populate({
        path: "progress.answeredQuestions.questionId",
        model: "Questions",
      });

    if (progress) return res.status(200).json(progress);

    // Fetch timeDuration from AppSettings
    const appSettings = await AppSettingsModel.findOne();
    const timeLeft = appSettings ? appSettings.timeDuration * 60 : 600;

    // Fetch content for the given category
    const categoryContents = await ContentModel.find({
      category: { $regex: `^${category}$`, $options: "i" },
    });

    if (!categoryContents.length)
      return res
        .status(404)
        .json({ message: "No content found for this category." });

    // Shuffle content
    const shuffledContents = categoryContents.sort(() => Math.random() - 0.5);

    // Generate progress with shuffled questions per content
    const progressData = await Promise.all(
      shuffledContents.map(async (content) => {
        let questions = await QuestionModel.find({ contentId: content._id });
        questions = questions.sort(() => Math.random() - 0.5);

        return {
          contentId: content._id,
          currentQuestionIndex: 0,
          answeredQuestions: questions.map((q) => ({
            questionId: q._id,
            selectedAnswers: [],
            isCorrect: false,
            isPartiallyCorrect: false,
            isDone: false,
          })),
        };
      })
    );

    // Create and save new progress
    progress = new ProgressModel({
      studentId: studentObjectId,
      category,
      progress: progressData,
      timeLeft,
      isDone: false,
      isRetake: false,
      lastUpdated: new Date(),
    });
    await progress.save();

    // Populate the newly created progress before returning
    const populatedProgress = await ProgressModel.findById(progress._id)
      .populate("studentId", "firstname middlename lastname email")
      .populate({ path: "progress.contentId", model: "Contents" })
      .populate({
        path: "progress.answeredQuestions.questionId",
        model: "Questions",
      });

    res.status(201).json(populatedProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get student progress
app.get("/getProgress/:studentId/:category/:isDone", async (req, res) => {
  try {
    const { studentId, category, isDone } = req.params;

    // ✅ Validate if studentId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const isDoneBoolean = isDone === "true"; // ✅ Convert string to boolean

    console.log("Fetching progress for:", {
      studentId,
      category,
      isDoneBoolean,
    });

    const progress = await ProgressModel.findOne({
      studentId: studentObjectId,
      category: { $regex: `^${category}$`, $options: "i" }, // Case-insensitive category search
      isDone: isDoneBoolean,
    })
      .populate("progress.contentId")
      .populate("progress.answeredQuestions.questionId")
      .exec();

    console.log("Progress fetched:", progress);

    res.json(progress || null);
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update progress for a specific student
app.put("/updateProgress/:progressId", async (req, res) => {
  try {
    const { progressId } = req.params;
    const updateData = req.body;

    // ✅ Validate progress ID format
    if (!mongoose.Types.ObjectId.isValid(progressId)) {
      return res.status(400).json({ error: "Invalid progress ID" });
    }

    // ✅ Find and update progress, only setting provided fields
    const updatedProgress = await ProgressModel.findByIdAndUpdate(
      progressId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("studentId", "firstname middlename lastname email") // ✅ Fetch student details
      .populate({
        path: "progress.contentId",
        model: "Contents", // ✅ Ensure correct model name (not "Contents")
      })
      .populate({
        path: "progress.answeredQuestions.questionId",
        model: "Questions",
      });

    // ✅ Check if progress exists
    if (!updatedProgress) {
      return res.status(404).json({ error: "Progress not found" });
    }

    res.json(updatedProgress);
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Update timeLeft for a given progress ID
app.put("/updateTimeLeft/:progressId", async (req, res) => {
  try {
    const { progressId } = req.params;
    const { timeLeft } = req.body;

    // ✅ Validate progress ID format
    if (!mongoose.Types.ObjectId.isValid(progressId)) {
      return res.status(400).json({ error: "Invalid progress ID" });
    }

    if (timeLeft === undefined) {
      return res.status(400).json({ error: "timeLeft is required" });
    }

    const updatedProgress = await ProgressModel.findByIdAndUpdate(
      progressId,
      { timeLeft, lastUpdated: new Date() }, // ✅ Update timeLeft & lastUpdated
      { new: true } // Return the updated document
    );

    if (!updatedProgress) {
      return res.status(404).json({ error: "Progress not found" });
    }

    res.json({
      message: "Time updated successfully",
      progress: updatedProgress,
    });
  } catch (error) {
    console.error("Error updating timeLeft:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get All Results
app.get("/getAllResults/:category/:isDone", async (req, res) => {
  try {
    const { category, isDone } = req.params;
    const isDoneBoolean = isDone === "true"; // Convert string to boolean

    console.log("Fetching progress for:", { category, isDoneBoolean });

    // Fetch all progress documents that match the given category and isDone status
    const progressRecords = await ProgressModel.find({
      category,
      isDone: isDoneBoolean,
    })
      .populate("studentId", "firstname middlename lastname email") // Populate student details
      .populate("progress.contentId")
      .populate("progress.answeredQuestions.questionId")
      .exec();

    console.log("Progress records fetched:", progressRecords);

    res.json(progressRecords);
  } catch (error) {
    console.error("Error fetching progress records:", error);
    res.status(500).json({ message: error.message });
  }
});

// File Maintenance
app.post("/saveCategory", async (req, res) => {
  try {
    const { description } = req.body;

    // Check if category with the same description (case-insensitive) already exists
    const existingCategory = await CategoryModel.findOne({
      description: { $regex: `^${description}$`, $options: "i" },
    });

    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this description already exists." });
    }

    // Create new category if description is unique
    const newCategory = await CategoryModel.create(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
  }
});

app.put("/updateActiveCategory/:description", async (req, res) => {
  try {
    const { description } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "Invalid isActive value, must be boolean" });
    }

    // Set all categories' isActive to false before updating the selected category
    await CategoryModel.updateMany({}, { isActive: false });

    // Find category by description (case-insensitive) and update isActive status
    const updatedCategory = await CategoryModel.findOneAndUpdate(
      { description: { $regex: `^${description}$`, $options: "i" } }, // Case-insensitive search
      { isActive: true }, // Ensure the selected category is active
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    res
      .status(500)
      .json({ message: "Error updating category", error: error.message });
  }
});

app.get("/getCategories", async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
});

app.get("/getCategory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: error.message });
  }
});

app.get("/getCategoryActive/:description", async (req, res) => {
  try {
    const { description } = req.params;

    // Find category case-insensitively
    const category = await CategoryModel.findOne({
      description: { $regex: `^${description}$`, $options: "i" },
    });

    if (!category) {
      return res
        .status(404)
        .json({ message: "Category not found", isActive: false });
    }

    res.json({ isActive: category.isActive });
  } catch (error) {
    console.error("Error checking category status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
