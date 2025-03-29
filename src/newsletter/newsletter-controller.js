const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Newsletter = require("./newsletter-modal");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const { subDays, startOfDay, endOfDay } = require("date-fns");

exports.createNewsletter = catchAsyncErrors(async (req, res, next) => {
    try {
        const newNewsletter = await Newsletter.create(req.body);
        sendResponse(res, 200, "Newsletter created successfully.", newNewsletter);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getAllNewsletters = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totalNewsletters = await Newsletter.countDocuments();

        const newsletters = await Newsletter.find({})
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "All Newsletters fetched successfully.", {
            totalNewsletters: totalNewsletters,
            totalPages: Math.ceil(totalNewsletters / 15),
            currentPage: parseInt(pageNumber, 10),
            newsletters
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getExportedNewslettersData = catchAsyncErrors(async (req, res, next) => {
    const days = parseInt(req.body.days);

    try {
        let query = {};

        if (days !== 0) {
            const date = new Date();
            date.setDate(date.getDate() - days);
            query.created_at = { $gte: date };
        }

        const newsletters = await Newsletter.find(query);
        sendResponse(res, 200, "All Newsletters fetched successfully.", newsletters);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});