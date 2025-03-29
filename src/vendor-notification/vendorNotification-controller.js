const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const VendorNotification = require("./vendorNotification-model");

exports.getAllVendorBookingNotification = catchAsyncErrors(async (req, res, next) => {
    try {
        const notifications = await VendorNotification.find({})
            .sort({ created_at: -1 }) // Sort by created_at in descending order
            .populate('booking_id')
            .populate('vendor_id')
           

        sendResponse(res, 200, "Notifications fetched successfully", notifications);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
