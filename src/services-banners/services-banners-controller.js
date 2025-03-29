const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ServicesBanner = require("./services-banners-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.createServiceBanner = catchAsyncErrors(async (req, res, next) => {
    try {
        const newServiceBanner = await ServicesBanner.create(req.body);
        sendResponse(res, 200, "Service Banner Created successfully.", newServiceBanner);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllServicesBanners = catchAsyncErrors(async (req, res, next) => {
    try {
        const servicesBanner = await ServicesBanner.find({});

        sendResponse(res, 200, "All Services Banners fetched successfully.", servicesBanner);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteServicesBannersByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceBannerID = req.params.id;

        const serviceBannerData = await ServicesBanner.findById(serviceBannerID);

        if (!serviceBannerData) {
            return next(new ErrorHandler("Services Banner Not Exist", 400));
        }

        const serviceBanner = await ServicesBanner.deleteOne({ _id: serviceBannerID });

        sendResponse(res, 200, "Service Banner Deleted Successfully.", serviceBanner);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});