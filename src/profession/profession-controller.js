const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Profession = require("./profession-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");

exports.createProfession = catchAsyncErrors(async (req, res, next) => {
    try {
        const newProfession = await Profession.create(req.body);
        sendResponse(res, 200, "Profession Created successfully.", newProfession);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getProfessionByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const professionID = req.params.id;
        const profession = await Profession.findById(professionID);

        sendResponse(res, 200, "Profession fetched successfully.", profession);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getAllProfession = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const totalProfessions = await Profession.countDocuments();

        const profession = await Profession.find({})
            .populate('service_id')
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "All Profession fetched successfully.", {
            totalProfessions: totalProfessions,
            totalPages: Math.ceil(totalProfessions / 15),
            currentPage: parseInt(pageNumber, 10),
            profession
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteProfession = catchAsyncErrors(async (req, res, next) => {
    try {
        const professionID = req.params.id;

        const professionData = await Profession.findById(professionID);

        if (!professionData) {
            return next(new ErrorHandler("Profession Not Exist", 400));
        }

        const professoin = await Profession.deleteOne({ _id: professionID });

        sendResponse(res, 200, "Profession Deleted Successfully.", professoin);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateProfession = catchAsyncErrors(async (req, res, next) => {
    try {
        const professoinID = req.params.id;

        const professionData = await Profession.findById(professoinID);

        if (!professionData) {
            return next(new ErrorHandler("Profession Data Not Exist", 400));
        }

        const profession = await Profession.findByIdAndUpdate(professoinID, req.body, {
            new: true,
            runValidators: true,
        })

        sendResponse(res, 200, "Profession Updated Successfully.", profession);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.searchProfessions = catchAsyncErrors(async (req, res, next) => {
    try {
        const searchString = req.params.term;
        const { pageNumber } = req.query;

        const query = {
            $or: [
                { profession_name: { $regex: searchString, $options: "i" } },
            ],
        };

        // Execute query
        const totalProfessions = await Profession.countDocuments(query);

        const professions = await Profession.find(query)
            .populate("service_id")
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        if (!professions.length) {
            return next(
                new ErrorHandler("No sub-services found matching the criteria", 404)
            );
        }

        sendResponse(res, 200, "All professions fetched successfully.", {
            totalProfessions: totalProfessions,
            totalPages: Math.ceil(totalProfessions / 15),
            currentPage: parseInt(pageNumber, 10),
            professions
        });


    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});