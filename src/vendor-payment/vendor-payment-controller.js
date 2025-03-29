const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const VendorPayments = require("./vendor-payment-model");
const bcrypt = require("bcryptjs");

// Create a new vendor payment
exports.createVendorPayment = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorPayment = await VendorPayments.create(req.body);
        sendResponse(res, 201, "Vendor Payment created successfully", vendorPayment);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get all vendor payments
exports.getAllVendorPayments = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorPayments = await VendorPayments.find();
        sendResponse(res, 200, "Vendor Payments fetched successfully", vendorPayments);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get a single vendor payment by ID
exports.getVendorPaymentById = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorPayment = await VendorPayments.findById(req.params.id);

        if (!vendorPayment) {
            return next(new ErrorHandler('Vendor Payment not found', 404));
        }

        sendResponse(res, 200, "Vendor Payment fetched successfully", vendorPayment);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Update a vendor payment by ID
exports.updateVendorPayment = catchAsyncErrors(async (req, res, next) => {
    try {
        let vendorPayment = await VendorPayments.findById(req.params.id);

        if (!vendorPayment) {
            return next(new ErrorHandler('Vendor Payment not found', 404));
        }

        vendorPayment = await VendorPayments.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        sendResponse(res, 200, "Vendor Payment updated successfully", vendorPayment);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Delete a vendor payment by ID
exports.deleteVendorPayment = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorPayment = await VendorPayments.findById(req.params.id);

        if (!vendorPayment) {
            return next(new ErrorHandler('Vendor Payment not found', 404));
        }

        await vendorPayment.remove();

        sendResponse(res, 200, "Vendor Payment deleted successfully");
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});