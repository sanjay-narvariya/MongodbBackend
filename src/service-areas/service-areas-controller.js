const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const ServiceArea = require("./service-areas-model");

exports.createServiceArea = catchAsyncErrors(async (req, res, next) => {
    try {
        const newServiceArea = await ServiceArea.create(req.body);
        sendResponse(res, 200, "Service Area Created Successfully", newServiceArea);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getAllServiceArea = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceArea = await ServiceArea.find({});

        sendResponse(res, 200, "Service Area Data Fetched Successfully", serviceArea);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getServiceAreaByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceAreaID = req.params.id;
        const serviceArea = await ServiceArea.findById(serviceAreaID);

        sendResponse(res, 200, "Service Area Data Fetched Successfully", serviceArea);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.updateServiceAreaByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceAreaID = req.params.id;

        const serviceArea = await ServiceArea.findByIdAndUpdate(serviceAreaID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!serviceArea) {
            return next(new ErrorHandler("Service Area not found!", 400));
        }

        sendResponse(res, 200, "Service Area Updated Successfully", serviceArea);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})