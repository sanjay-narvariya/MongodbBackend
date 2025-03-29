const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Faq = require("./faq-model");

exports.createFaq = catchAsyncErrors(async (req, res, next) => {
    try {
        const newFaq = await Faq.create(req.body);
        sendResponse(res, 200, "Faq Created Successfully", newFaq);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getAllFaq = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const totalFaqs = await Faq.countDocuments();

        const faq = await Faq.find()
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "FAQ Data Fetched Successfully", {
            totalFaqs: totalFaqs,
            totalPages: Math.ceil(totalFaqs / 15),
            currentPage: parseInt(pageNumber, 10),
            faq
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.updateFaqByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const faqID = req.params.id;

        const faq = await Faq.findByIdAndUpdate(faqID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!faq) {
            return next(new ErrorHandler("FAQ not found!", 400));
        }

        sendResponse(res, 200, "FAQ Updated Successfully", faq);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.deleteFaqByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const faqID = req.params.id;

        const faqData = await Faq.findById(faqID);

        if (!faqData) {
            return next(new ErrorHandler("FAQ Not Exist", 400));
        }

        const faq = await Faq.deleteOne({ _id: faqID });

        sendResponse(res, 200, "FAQ Deleted Successfully.", faq);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});