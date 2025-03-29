const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Feedback = require("./feedback-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.createFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const newFeedback = await Feedback.create(req.body);
        sendResponse(res, 200, "Feedback Created successfully.", newFeedback);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllFeedback = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totalFeedbacks = await Feedback.countDocuments();

        const feedbacks = await Feedback.find()
            .populate("customer_id")
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "All feedback fetched successfully.", {
            totalFeedbacks: totalFeedbacks,
            totalPages: Math.ceil(totalFeedbacks / 15),
            currentPage: parseInt(pageNumber, 10),
            feedbacks
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const feedbackID = req.params.id;

        const feedbackData = await Feedback.findById(feedbackID);

        if (!feedbackData) {
            return next(new ErrorHandler("feedback Not Exist", 400));
        }

        const feedback = await Feedback.deleteOne({ _id: feedbackID });

        sendResponse(res, 200, "Feedback Deleted Successfully.", feedback);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateFeedback = catchAsyncErrors(async (req, res, next) => {
    try {
        const feedbackID = req.params.id;

        const feedbackData = await Feedback.findById(feedbackID);
        if (!feedbackData) {
            return next(new ErrorHandler("Feedback Not Exist", 400));
        }

        const feedback = await Feedback.findByIdAndUpdate(feedbackID, req.body, {
            new: true,
            runValidators: true,
        })

        sendResponse(res, 200, "Feedback Updated Successfully.", feedback);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getFeedbackByCustomerID = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.customerid;
        const feedback = await Feedback.find({ customer_id: customerID });

        sendResponse(res, 200, "Feeback Fetched Successfully By Customer ID", feedback);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});