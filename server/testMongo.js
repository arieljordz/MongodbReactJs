const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://arieljordz:rlxgKA7ofXL9POby@cluster0.7fotz.mongodb.net/mongodb_reactjs";

const CategorySchema = new mongoose.Schema({
  description: String,
  isActive: Boolean,
});
const CategoryModel = mongoose.model("Category", CategorySchema);

async function testFind() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ Connected to MongoDB");

    const categories = await CategoryModel.find({});
    console.log("📂 Found Categories:", categories);
  } catch (error) {
    console.error("❌ Error finding categories:", error);
  } finally {
    await mongoose.connection.close();
  }
}

testFind();
