const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const ContentModel = require("./models/Contents");

const app = express();
app.use(express.json());
// app.use(cors());

const corsOptions = {
    origin: "http://localhost:5173", 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
};

app.use(cors(corsOptions));

// Connect to MongoDB (local, without authentication)
const mongoURI = "mongodb://127.0.0.1:27017/reactjsmongodb";
mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to local MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Create (Add) Content
app.post("/createContent", async (req, res) => {
    try {
        const newContent = await ContentModel.create(req.body);
        res.status(201).json(newContent);
    } catch (error) {
        res.status(500).json({ message: "Error creating contentsss", error: error.message });
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
        const { title, description } = req.body;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid content ID" });
        }

        // Validate required fields
        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({ message: "Title and Description are required" });
        }

        const updatedContent = await ContentModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true, runValidators: true } // Return updated doc, enforce schema validation
        );

        if (!updatedContent) {
            return res.status(404).json({ message: "Content not found" });
        }

        res.status(200).json(updatedContent);
    } catch (error) {
        console.error("Error updating content:", error);
        res.status(500).json({ message: "Error updating content", error: error.message });
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

        res.status(200).json({ message: "Content deleted successfully", deletedContent });
    } catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Error deleting content", error: error.message });
    }
});



// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));