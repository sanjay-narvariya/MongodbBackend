const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Review = require("./reviews-model");

exports.createReview = catchAsyncErrors(async (req, res, next) => {
    try {
        const newReview = await Review.create(req.body);
        sendResponse(res, 200, "Review Created Successfully", newReview);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllReviews = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totalReviews = await Review.countDocuments();

        const reviews = await Review.find()
            .populate("customer_id")
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "Review Data Fetched Successfully", {
            totalReviews: totalReviews,
            totalPages: Math.ceil(totalReviews / 15),
            currentPage: parseInt(pageNumber, 10),
            reviews
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllReviewByCustomerID = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.customerid;

        const review = await Review.find({ customer_id: customerID }).populate('customer_id')
            .populate('booking_id')

        sendResponse(res, 200, "Review By Customer Data Fetched Successfully", review);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getReviewByBookingID = catchAsyncErrors(async (req, res, next) => {
    try {
        const bookingID = req.params.bookingid;

        const review = await Review.find({ booking_id: bookingID })

        sendResponse(res, 200, "Review By Booking Data Fetched Successfully", review);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllReviewByServiceID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceID = req.params.serviceid;
        const { pageNumber = 1 } = req.query;
        const totalReviews = await Review.countDocuments();

        // Fetch reviews for the specified service ID
        const reviews = await Review.find({ service_id: serviceID })
            .populate('customer_id')
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        // const uniqueReviews = Array.from(new Map(reviews.map(review => [review?.customer_id._id?.toString(), review])).values());

        sendResponse(res, 200, "Review By Service ID Fetched Successfully", {
            totalReviews: totalReviews,
            totalPages: Math.ceil(totalReviews / 15),
            currentPage: parseInt(pageNumber, 10),
            reviews
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateReviewByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const reviewID = req.params.id;

        const review = await Review.findByIdAndUpdate(reviewID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!review) {
            return next(new ErrorHandler("Review not found!", 400));
        }

        sendResponse(res, 200, "Review Updated Successfully", review);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.deleteReviewByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const reviewID = req.params.id;

        const reviewData = await Review.findById(reviewID);

        if (!reviewData) {
            return next(new ErrorHandler("Review Not Exist", 400));
        }

        const review = await Review.deleteOne({ _id: reviewID });

        sendResponse(res, 200, "Review Deleted Successfully.", review);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.getAllReviewByVendorID = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;

        const vendor = await Review.find({ vendor_id: vendorID })
            .populate('booking_id');

        sendResponse(res, 200, "Review By Vender Data Fetched Successfully.", vendor);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});