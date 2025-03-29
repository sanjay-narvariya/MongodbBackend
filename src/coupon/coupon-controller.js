const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Coupon = require("./coupon-model");

exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        sendResponse(res, 200, "Coupon Created Successfully", newCoupon);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllCoupon = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totalCoupons = await Coupon.countDocuments();

        const coupon = await Coupon.find({})
            .skip((pageNumber - 1) * 15)
            .sort({ created_at: -1 })
            .limit(15);

        sendResponse(res, 200, "Customer Data Fetched Successfully", {
            totalCoupons: totalCoupons,
            totalPages: Math.ceil(totalCoupons / 15),
            currentPage: parseInt(pageNumber, 10),
            coupon,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.getCoupon = catchAsyncErrors(async (req, res, next) => {
    try {
        const { couponCode } = req.body;

        const coupon = await Coupon.findOne({
            coupon_code: couponCode
        })

        if (!coupon) {
            return next(new ErrorHandler("Coupon Not Exist", 400));
        }

        sendResponse(res, 200, "Coupon Data Fetched Successfully", coupon);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.deleteCouponByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const couponID = req.params.id;

        const couponData = await Coupon.findById(couponID);
        if (!couponData) {
            return next(new ErrorHandler("Copuon not found", 400));
        }

        const coupon = await Coupon.deleteOne({ _id: couponID });

        sendResponse(res, 200, "Coupon deleted successfully", coupon);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateCouponByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const couponID = req.params.id;

        const coupon = await Coupon.findByIdAndUpdate(couponID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!coupon) {
            return next(new ErrorHandler("Coupon not found!", 400));
        }

        sendResponse(res, 200, "Coupon Updated Successfully", coupon);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.searchCoupons = catchAsyncErrors(async (req, res, next) => {
    try {

        const searchString = req.params.term;
        const { pageNumber } = req.query;

        // Convert search term to a number if possible
        const searchNumber = parseFloat(searchString);

        const query = {
            $or: [
                { coupon_code: { $regex: searchString, $options: "i" } },
                ...(isNaN(searchNumber) ? [] : [{ discount_value: searchNumber }])
            ],
        };

        // Execute query
        const totalCoupons = await Coupon.countDocuments(query);

        const coupons = await Coupon.find(query)
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        if (!coupons.length) {
            return next(
                new ErrorHandler("No coupons found matching the criteria", 404)
            );
        }

        sendResponse(res, 200, "All coupons fetched successfully.", {
            totalCoupons: totalCoupons,
            totalPages: Math.ceil(totalCoupons / 15),
            currentPage: parseInt(pageNumber, 10),
            coupons
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});
