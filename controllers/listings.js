const Listing = require("../models/listing")
const axios = require("axios");

async function geocodeLocation(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    const { data } = await axios.get(url, {
        headers: { "User-Agent": "GhuumoApp/1.0" }   // prevents 403 errors
    });
    if (data.length === 0) return null;
    return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
    };
}


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });

}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate({
            path: 'reviews',
            populate: {
                path: "author"
            },
        })
            .populate("owner");

        if (!listing) {
            req.flash("error", "Listing Not Found!");
            res.redirect("/listings");
            return;
        }
        listing.views += 1;
        await listing.save();
        res.render("listings/show", { listing });
    } catch (err) {
        next(err);
    }
}

module.exports.createListing = async (req, res, next) => {
    const geoData = await geocodeLocation(req.body.listing.location);

    const newListing = new Listing(req.body.listing);

    if (geoData) {
        newListing.latitude = geoData.lat;
        newListing.longitude = geoData.lon;
    }

    let url = req.file.path;
    let filename = req.file.filename;

    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect(`/listings`);
};

module.exports.renderEditForm = async (req, res) => {

    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing Not Found!");
        res.redirect("/listings");
        return;
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });

    if (req.body.listing.location) {
        const geoData = await geocodeLocation(req.body.listing.location);

        if (geoData) {
            listing.latitude = geoData.lat;
            listing.longitude = geoData.lon;
        }
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    console.log("Deleted listing with id:", id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}

module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({ category });
    res.render("listings/index", { allListings, category });
};


module.exports.trendingListings = async (req, res) => {
    const allListings = await Listing.find({})
        .sort({ views: -1 })
        .limit(15);
  
    res.render("listings/index", { allListings, category: "trending" });
};

module.exports.searchListings = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Please enter a location to search.");
        return res.redirect("/listings");
    }

    const cleaned = q.split(",")[0].trim(); // City or main area

    const allListings = await Listing.find({
        location: { $regex: cleaned, $options: "i" }
    });

    res.render("listings/index", { allListings });
};

