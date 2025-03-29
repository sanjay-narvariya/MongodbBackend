const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const SubAdmin = require("./sub-admin-model");
const bcrypt = require("bcryptjs");
const sendToken = require("../../utils/jwtToken");

exports.createSubAdmin = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, 10);

        const currentSubAdmin = await SubAdmin.findOne({ email });

        if (currentSubAdmin) {
            return next(new ErrorHandler("sub admin email already exist.", 500));
        }

        const newSubAdmin = await SubAdmin.create({ ...req.body, password: hash });

        sendResponse(res, 200, "SubAdmin created successfully", newSubAdmin);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.subAdminLogin = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const subAdmin = await SubAdmin.findOne({ email });

        if (!subAdmin) {
            return res.status(500).json({ status: false, message: "Sub Admin does not exist" })
        }

        const passwordMatch = await bcrypt.compare(password, subAdmin.password)

        if (passwordMatch) {
            sendToken(subAdmin, 200, res, "Account created successfully");
            // sendResponse(res, 200, "Sub Admin Login successfully", subAdmin);
        }
        else {
            sendResponse(res, 401, "Password Incorrect", {});
        }

    } catch (error) {
        return res.status(500).json({ status: false, data: error.message })
    }
});



exports.getAllSubAdmin = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totalSubAdmins = await SubAdmin.countDocuments();

        const subAdmins = await SubAdmin.find({})
            .populate('permissions')
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "All Sub Admin Data Fetched Successfully", {
            totalSubAdmins: totalSubAdmins,
            totalPages: Math.ceil(totalSubAdmins / 15),
            currentPage: parseInt(pageNumber, 10),
            subAdmins
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getSubAdminByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subAdminID = req.params.id;
        const subAdmin = await SubAdmin.findById(subAdminID);

        sendResponse(res, 200, "Sub Admin By ID Fetched Successfully", subAdmin);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.deleteSubAdminByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subAdminID = req.params.id;

        const subAdminData = await SubAdmin.findById(subAdminID);
        if (!subAdminData) {
            return next(new ErrorHandler("Sub Admin not found", 400));
        }

        const subAdmin = await SubAdmin.deleteOne({ _id: subAdminID });

        sendResponse(res, 200, "Sub Admin deleted successfully", subAdmin);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateSubAdminByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subAdminID = req.params.id;

        const subAdmin = await SubAdmin.findByIdAndUpdate(subAdminID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!subAdmin) {
            return next(new ErrorHandler("Sub Admin not found!", 400));
        }

        sendResponse(res, 200, "Sub Admin Updated Successfully", subAdmin);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.searchSubAdmins = catchAsyncErrors(async (req, res, next) => {
    try {

        const searchString = req.params.term;
        const { pageNumber } = req.query;

        const query = {
            $or: [
                { full_name: { $regex: searchString, $options: "i" } },
                { email: { $regex: searchString, $options: "i" } },
                { phone: { $regex: searchString, $options: "i" } },
                { city: { $regex: searchString, $options: "i" } },
            ],
        };

        // Execute query
        const totalSubAdmins = await SubAdmin.countDocuments(query);

        const subAdmins = await SubAdmin.find(query)
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        if (!subAdmins.length) {
            return next(
                new ErrorHandler("No customers found matching the criteria", 404)
            );
        }

        sendResponse(res, 200, "All Sub Admins fetched successfully.", {
            totalSubAdmins: totalSubAdmins,
            totalPages: Math.ceil(totalSubAdmins / 15),
            currentPage: parseInt(pageNumber, 10),
            subAdmins
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});