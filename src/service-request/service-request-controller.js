const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const ServiceRequest = require("./service-request-model");
const fs = require('fs');

exports.createServiceRequest = catchAsyncErrors(async (req, res, next) => {
    try {
        const newServiceRequest = await ServiceRequest.create(req.body);
        sendResponse(res, 200, "Service Requested Created Successfully", newServiceRequest);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getAllServiceRequest = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceRequest = await ServiceRequest.find({});

        sendResponse(res, 200, "Service Requested Data Fetched Successfully", serviceRequest);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getServiceRequestByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceRequestID = req.params.id;
        const serviceRequest = await ServiceRequest.findById(serviceRequestID);

        sendResponse(res, 200, "Service Requested Data Fetched Successfully", serviceRequest);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.updateServiceRequestByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceRequestID = req.params.id;

        const serviceRequest = await ServiceRequest.findByIdAndUpdate(serviceRequestID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!serviceRequest) {
            return next(new ErrorHandler("Service Request not found!", 400));
        }

        sendResponse(res, 200, "Service Request Updated Successfully", serviceRequest);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})