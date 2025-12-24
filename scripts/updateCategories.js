const mongoose = require("mongoose");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/ghuumo";

const detectCategory = (listing) => {
    const text = `${listing.title} ${listing.location} ${listing.country}`.toLowerCase();

    if (
        text.includes("beach") ||
        text.includes("bali") ||
        text.includes("cancun") ||
        text.includes("maldives") ||
        text.includes("coast") ||
        text.includes("island")
    ) return "Beaches";

    if (
        text.includes("mountain") ||
        text.includes("aspen") ||
        text.includes("banff") ||
        text.includes("switzerland") ||
        text.includes("alps")
    ) return "Mountains";

    if (
        text.includes("apartment") ||
        text.includes("loft") ||
        text.includes("penthouse") ||
        text.includes("city") ||
        text.includes("studio")
    ) return "Apartments";

    // default fallback
    return "Rooms";
};

async function updateAllListings() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB...");

    const listings = await Listing.find({ category: { $exists: false } });
    console.log(`Found ${listings.length} listings without category.`);

    for (let listing of listings) {
        const cat = detectCategory(listing);
        listing.category = cat;
        await listing.save();
        console.log(`✔ Updated "${listing.title}" → ${cat}`);
    }

    console.log("🎉 Category update complete!");
    process.exit();
}

updateAllListings();
