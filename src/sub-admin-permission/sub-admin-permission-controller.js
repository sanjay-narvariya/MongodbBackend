const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const SubAdminPermission = require("./sub-admin-permission-model");

exports.createSubAdminPermission = catchAsyncErrors(async (req, res, next) => {
    try {
        const newSubAdminPermission = await SubAdminPermission.create(req.body);
        sendResponse(res, 200, "Sub Admission Created Successfully", newSubAdminPermission);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getAllSubAdminPermission = catchAsyncErrors(async (req, res, next) => {
    try {

        const { pageNumber } = req.query;
        const totalPermissions = await SubAdminPermission.countDocuments();

        const subAdminPermission = await SubAdminPermission.find({})
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "Sub Admin Permission Fetched Successfully", {
            totalPermissions: totalPermissions,
            totalPages: Math.ceil(totalPermissions / 15),
            currentPage: parseInt(pageNumber, 10),
            subAdminPermission
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getSubAdminPermissionByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subAdminPermissionID = req.params.id;
        const subAdminPermission = await SubAdminPermission.findById(subAdminPermissionID);

        sendResponse(res, 200, "Sub Admin Permission Data Fetched Successfully", subAdminPermission);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.deleteSubAdminPermissionByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subAdminPermissionID = req.params.id;

        const subAdminPermissionData = await SubAdminPermission.findById(subAdminPermissionID);
        if (!subAdminPermissionData) {
            return next(new ErrorHandler("Sub Admin Permission not found", 400));
        }

        const subAdminPermission = await SubAdminPermission.deleteOne({ _id: subAdminPermissionID });

        sendResponse(res, 200, "Sub Admin Permission deleted successfully", subAdminPermission);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.updateSubAdminPermissionByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subAdminPermissionID = req.params.id;

        const subAdminPermission = await SubAdminPermission.findByIdAndUpdate(subAdminPermissionID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!subAdminPermission) {
            return next(new ErrorHandler("Sub Admission Permission not found!", 400));
        }

        sendResponse(res, 200, "Sub Admission Permission Data Fetched Successfully", subAdminPermission);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})




exports.searchPermissions = catchAsyncErrors(async (req, res, next) => {
    try {

        const searchString = req.params.term;
        const { pageNumber } = req.query;

        const query = {
            $or: [
                { permission_name: { $regex: searchString, $options: "i" } },
            ],
        };

        // Execute query
        const totalPermissions = await SubAdminPermission.countDocuments(query);

        const subAdminPermission = await SubAdminPermission.find(query)
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        if (!subAdminPermission.length) {
            return next(
                new ErrorHandler("No customers found matching the criteria", 404)
            );
        }

        sendResponse(res, 200, "All Sub Admins fetched successfully.", {
            totalPermissions: totalPermissions,
            totalPages: Math.ceil(totalPermissions / 15),
            currentPage: parseInt(pageNumber, 10),
            subAdminPermission
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});