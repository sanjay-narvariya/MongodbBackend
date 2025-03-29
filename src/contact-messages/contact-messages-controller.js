const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const ContactMessage = require("./contact-messages-model");

exports.createContactMessages = catchAsyncErrors(async (req, res, next) => {
    try {
        const newContactMessage = await ContactMessage.create(req.body);
        sendResponse(res, 200, "Contact Message Created Successfully", newContactMessage);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});