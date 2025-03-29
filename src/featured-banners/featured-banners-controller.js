const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const FeaturedBanner = require("./featured-banners-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.createFeaturedBanner = catchAsyncErrors(async (req, res, next) => {
    try {
        const newFeaturedBanner = await FeaturedBanner.create(req.body);
        sendResponse(res, 200, "Featured Banner Created successfully.", newFeaturedBanner);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllFeaturedBanner = catchAsyncErrors(async (req, res, next) => {
    try {
        const featuredBanner = await FeaturedBanner.find({});

        sendResponse(res, 200, "All Featured Banner fetched successfully.", featuredBanner);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteFeaturedBannerByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const featuredBannerID = req.params.id;

        const featuredBannerData = await FeaturedBanner.findById(featuredBannerID);

        if (!featuredBannerData) {
            return next(new ErrorHandler("Featured Banner Not Exist", 400));
        }

        const featuredBanner = await FeaturedBanner.deleteOne({ _id: featuredBannerID });

        sendResponse(res, 200, "Featured Banner Deleted Successfully.", featuredBanner);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
