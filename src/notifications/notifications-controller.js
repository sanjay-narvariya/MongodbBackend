const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Notification = require("../notifications/notifications-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.createNotification = catchAsyncErrors(async (req, res, next) => {
    try {
        const newNotification = await Notification.create(req.body);
        sendResponse(res, 200, "Notification Created successfully.", newNotification);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllNotifications = catchAsyncErrors(async (req, res, next) => {
    try {
        const notifications = await Notification.find({})
            .sort({ created_at: -1 }) // Sort by created_at in descending order
            .limit(15) // Limit to 15 records
            .populate('booking_id')
            .populate({
                path: 'customer_id',
                select: 'full_name address',
                populate: {
                    path: 'address',
                    match: { '0.city': { $exists: true } },
                    select: 'city'
                }
            });

        sendResponse(res, 200, "Notifications fetched successfully", notifications);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
