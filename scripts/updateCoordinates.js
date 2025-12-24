const mongoose = require("mongoose");
const axios = require("axios");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/ghuumo";

async function geocodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const { data } = await axios.get(url, {
        headers: { "User-Agent": "GhuumoApp/1.0" }
    });
    if (!data.length) return null;
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
    };
}

async function updateAllListings() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB...");

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings...`);

    for (let listing of listings) {
        const query = `${listing.location}, ${listing.country}`;
        console.log(`Geocoding: ${listing.title} (${query})`);

        const geoData = await geocodeLocation(query);

        if (geoData) {
            listing.latitude = geoData.lat;
            listing.longitude = geoData.lon;

            await listing.save();
            console.log(`✔ Updated: ${listing.title}`);
        } else {
            console.log(`❌ No coordinates found for: ${listing.title}`);
        }

        await new Promise(resolve => setTimeout(resolve, 1000)); // prevent rate limit
    }

    console.log("🎉 All listings updated!");
    mongoose.connection.close();
}

updateAllListings();
