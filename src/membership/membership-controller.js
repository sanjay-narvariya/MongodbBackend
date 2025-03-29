const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Membership = require("./membership-model");
const fs = require('fs');

exports.createMembership = catchAsyncErrors(async (req, res, next) => {
    try {
        const newMembership = await Membership.create(req.body);
        sendResponse(res, 200, "Membership Created Successfully", newMembership);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getAllMembership = catchAsyncErrors(async (req, res, next) => {
    try {
        const membership = await Membership.find();

        sendResponse(res, 200, "MemberShp Data Fetched Successfully", membership);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getMembershipByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const membershipID = req.params.id;
        const membership = await Membership.findById(membershipID);

        sendResponse(res, 200, "membership Data Fetched Successfully", membership);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.updateMembershipByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const membershipID = req.params.id;

        const membership = await Membership.findByIdAndUpdate(membershipID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!membership) {
            return next(new ErrorHandler("membership not found!", 400));
        }

        sendResponse(res, 200, "Member ship Updated Successfully", membership);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


