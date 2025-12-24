// 1. Load environment variables
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./ghuumo.listings.json");
const Listing = require("../models/listing");
const User = require("../models/user");

// 2. Use the environment variable (Secure)
// const MONGO_URL = "mongodb+srv://SuvayuBiswas:Travel2025@..."; // <--- DELETE THIS LINE
const MONGO_URL = process.env.ATLASDB_URL; 

async function main() {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB successfully.");

    await initDB();
    
    // mongoose.connection.close();
  } catch (err) {
    console.error("❌ Connection Failed:", err);
  }
}

const initDB = async () => {
  try {
    // Clear Data
    await Listing.deleteMany({});
    await User.deleteMany({});
    console.log("Step 1: Cleared old listings and users.");

    // Create Admin
    const adminUser = new User({
      email: "admin@ghuumo.com",
      username: "admin"
    });
    const registeredAdmin = await User.register(adminUser, "admin123");
    console.log(`Step 2: Admin user created (ID: ${registeredAdmin._id})`);

    // Create Listings
    const cleanedData = initData.map((obj) => ({
      ...obj,
      _id: obj._id.$oid ? obj._id.$oid : obj._id,
      owner: registeredAdmin._id, 
      reviews: [], 
    }));

    await Listing.insertMany(cleanedData);
    console.log("Step 3: Listings initialized successfully!");

  } catch (err) {
    console.error("❌ Error inside initDB:", err);
  }
};

main();