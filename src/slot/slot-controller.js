const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Slot = require("../slot/slot-model");

exports.createSlot = catchAsyncErrors(async (req, res, next) => {
    try {
        const newSlot = await Slot.create(req.body);

        sendResponse(res, 200, "Slot Created Successfully", newSlot);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getAllSlot = catchAsyncErrors(async (req, res, next) => {
    try {
        const slot = await Slot.find({});

        sendResponse(res, 200, "All Slot Data Fetched Successfully", slot);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.deleteSlotByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const slotID = req.params.id;

        const slotData = await Slot.findById(slotID);
        if (!slotData) {
            return next(new ErrorHandler("Slot not found", 400));
        }

        const slot = await Slot.findOneAndDelete({ _id: slotID });

        sendResponse(res, 200, "Slot deleted successfully", slot);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateSlotByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const slotID = req.params.id;

        const slotData = await Slot.findByIdAndUpdate(slotID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!slotData) {
            return next(new ErrorHandler("Slot not found!", 400));
        }

        sendResponse(res, 200, "Slot Updated Successfully", slotData);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});