const mongoose = require("mongoose");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/ghuumo";

const mapOldToNew = (cat) => {
    const c = cat.toLowerCase();

    if (c.includes("beach")) return "beach";
    if (c.includes("mountain")) return "mountain";
    if (c.includes("apartment")) return "apartment";
    return "room";  // fallback
};

async function start() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected.");

    const listings = await Listing.find({});

    for (let listing of listings) {
        listing.category = mapOldToNew(listing.category || "");
        await listing.save();
        console.log(`✔ ${listing.title} → ${listing.category}`);
    }

    console.log("Done.");
    process.exit();
}

start();
