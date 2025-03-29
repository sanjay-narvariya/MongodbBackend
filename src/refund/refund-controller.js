const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Refund = require("./refund-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Booking = require("../booking/booking-model")

exports.createRefund = catchAsyncErrors(async (req, res, next) => {
    try {
        const { booking_id, refund_amount, org_amount } = req.body;
        const newRefund = await Refund.create(req.body);

        const booking = await Booking.findByIdAndUpdate(
            booking_id,
            { booking_status: 'cancelled', refund_amount },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return next(new ErrorHandler('Booking not found', 404));
        }

        sendResponse(res, 200, "Refund created and booking status updated successfully.", newRefund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.createUnserviceableRefund = catchAsyncErrors(async (req, res, next) => {
    try {
        const { booking_id, refund_amount, org_amount } = req.body;

        const newRefund = await Refund.create(req.body);

        const booking = await Booking.findByIdAndUpdate(
            booking_id,
            { refund_amount },
            { new: true, runValidators: true }
        );

        if (!booking) {
            return next(new ErrorHandler('Booking not found', 404));
        }

        sendResponse(res, 200, "Refund created and booking status updated successfully.", newRefund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getRefundByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const refundID = req.params.id;
        const refund = await Refund.findById(refundID);

        sendResponse(res, 200, "Refund fetched successfully.", refund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllRefund = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const totalRefunds = await Refund.countDocuments();

        const refund = await Refund.find({})
            .populate("customer_id")
            .populate("booking_id")
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "All Refund fetched successfully.", {
            totalRefunds: totalRefunds,
            totalPages: Math.ceil(totalRefunds / 15),
            currentPage: parseInt(pageNumber, 10),
            refund
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteRefund = catchAsyncErrors(async (req, res, next) => {
    try {
        const refundID = req.params.id;

        const refundData = await Refund.findById(refundID);

        if (!refundData) {
            return next(new ErrorHandler("Refund Not Exist", 400));
        }

        const refund = await Refund.deleteOne({ _id: refundID });

        sendResponse(res, 200, "Refund Deleted Successfully.", refund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateRefund = catchAsyncErrors(async (req, res, next) => {
    try {
        const refundID = req.params.id;

        const refundData = await Refund.findById(refundID);
        if (!refundData) {
            return next(new ErrorHandler("Refund Data Not Exist", 400));
        }

        const refund = await Refund.findByIdAndUpdate(refundID, req.body, {
            new: true,
            runValidators: true,
        })

        sendResponse(res, 200, "Refund Updated Successfully.", refund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getRefundByCustomerID = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.customerid;
        const refund = await Refund.find({ customer_id: customerID });

        sendResponse(res, 200, "Refund Fetcheds Successfully By Customer ID", refund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getRefundByBookingID = catchAsyncErrors(async (req, res, next) => {
    try {
        const bookingID = req.params.bookingid;
        const refund = await Refund.find({ booking_id: bookingID });

        sendResponse(res, 200, "Refund Fetched Successfully By Customer ID", refund);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// const moment = require('moment'); // You can use moment.js for date manipulation

// vendorSchema.statics.getLastMonthEarnings = async function (vendorId) {
//     // Calculate the start and end of last month
//     const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
//     const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

//     const vendor = await this.findById(vendorId);
//     if (!vendor) {
//         throw new Error('Vendor not found');
//     }

//     // Filter total_earnings based on date
//     const lastMonthEarnings = vendor.total_earnings.filter(earning => {
//         return earning.date >= startOfLastMonth && earning.date <= endOfLastMonth;
//     });

//     // Sum the earnings
//     const totalEarnings = lastMonthEarnings.reduce((sum, earning) => sum + earning.earnings, 0);

//     return totalEarnings;
// };
