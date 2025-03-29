const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const SubService = require("./sub-services-model");
const Service = require("../services/services-model");
const Reviews = require("../reviews/reviews-model");
const fs = require('fs');
const Booking = require("../booking/booking-model");

// exports.createSubService = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const newSubService = await SubService.create({ ...req.body, sub_service_image: req.file.filename });
//         sendResponse(res, 200, "Sub Service Created Successfully", newSubService);
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });

exports.createSubService = catchAsyncErrors(async (req, res, next) => {
    try {
        // Create the new sub-service
        const newSubService = await SubService.create({ ...req.body, sub_service_image: req.file.filename });

        // Update the parent service to include this new sub-service in its sub_services array
        await Service.findByIdAndUpdate(
            req.body.parent_service_id,
            { $addToSet: { sub_services: newSubService._id } }
        );

        sendResponse(res, 200, "Sub Service Created Successfully", newSubService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// exports.getAllSubServices = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const { pageNumber } = req.query;
//         const totalSubServices = await SubService.countDocuments();

//         const subServices = await SubService.find({})
//             .populate("parent_service_id")
//             .sort({ created_at: -1 })
//             .skip((pageNumber - 1) * 15)
//             .limit(15);

//         const subServicesWithReviews = await Promise.all(subServices.map(async (subService) => {
//             const reviews = await Reviews.find({ sub_service_id: subService._id });
//             return { ...subService._doc, reviews };
//         }));

//         sendResponse(res, 200, "Sub Service Data Fetched Successfully", {
//             totalSubServices: totalSubServices,
//             totalPages: Math.ceil(totalSubServices / 15),
//             currentPage: parseInt(pageNumber, 10),
//             subServicesWithReviews
//         });
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });


exports.getAllSubServices = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const page = parseInt(pageNumber, 10) || 1;
        const limit = 15;

        const totalSubServices = await SubService.countDocuments();

        const subServicesWithReviews = await SubService.aggregate([
            { $sort: { created_at: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'sub_service_id',
                    as: 'reviews'
                }
            },
            {
                $addFields: {
                    totalReviews: { $size: '$reviews' },
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: '$reviews' }, 0] },
                            then: {
                                $avg: '$reviews.rating'
                            },
                            else: 0
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'services', // The name of the collection for Service model
                    localField: 'parent_service_id',
                    foreignField: '_id',
                    as: 'parent_service_id'
                }
            },
            {
                $addFields: {
                    parent_service_id: { $arrayElemAt: ['$parent_service_id', 0] } // Unwraps the service object from the array
                }
            }
        ]);

        sendResponse(res, 200, "Sub Service Data Fetched Successfully", {
            totalSubServices,
            totalPages: Math.ceil(totalSubServices / limit),
            currentPage: page,
            subServices: subServicesWithReviews
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getSubServicesSuggestion = catchAsyncErrors(async (req, res, next) => {
    try {
        const subServices = await SubService.aggregate([
            { $sample: { size: 15 } }
        ]);

        const populatedSubServices = await SubService.populate(subServices, { path: "parent_service_id" });

        const subServicesWithReviews = await Promise.all(populatedSubServices.map(async (subService) => {
            const reviews = await Reviews.find({ sub_service_id: subService._id });
            return { ...subService, reviews };
        }));

        sendResponse(res, 200, "Sub Service Data Fetched Successfully", subServicesWithReviews);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.getSubServicesForOnSite = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.id;

        const latestBooking = await Booking.find({
            customer_id: customerID
        })
            .sort({ created_at: -1 })
            .limit(1).select("service_id");


        if (latestBooking.length === 0) {
            return next(new ErrorHandler("Last Booking Not Found!", 500));
        }

        const services = latestBooking[0]?.service_id;

        const subService = await SubService.find({
            parent_service_id: { $in: services }
        });

        sendResponse(res, 200, "Sub Service Data Fetched Successfully", subService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getSubServiceByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subServiceID = req.params.id;
        const subServices = await SubService.findById(subServiceID).populate("parent_service_id");

        sendResponse(res, 200, "Sub Service Data Fetched Successfully", subServices);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// exports.deleteSubServiceByID = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const subServiceID = req.params.id;
//         const subService = await SubService.findById(subServiceID);

//         if (!subService) {
//             return next(new ErrorHandler("Sub Service not found", 400));
//         }

//         if (subService.sub_service_image) {
//             fs.unlink(`uploads/service-picture/${subService.sub_service_image}`, async (error) => {
//                 if (error) {
//                     return next(new ErrorHandler(error.message, 500));
//                 }

//                 const deletedSubServices = await SubService.findOneAndDelete({ _id: subServiceID });
//                 sendResponse(res, 200, "Sub Services deleted successfully", deletedSubServices);
//             });
//         } else {
//             const deletedSubServices = await SubService.findOneAndDelete({ _id: subServiceID });
//             sendResponse(res, 200, "Sub Services deleted successfully", deletedSubServices);
//         }
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });


exports.deleteSubServiceByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subServiceID = req.params.id;
        const subService = await SubService.findById(subServiceID);

        if (!subService) {
            return next(new ErrorHandler("Sub Service not found", 400));
        }

        const parentServiceID = subService.parent_service_id;

        const deleteSubService = async () => {
            // Delete the sub-service
            const deletedSubService = await SubService.findOneAndDelete({ _id: subServiceID });

            // Remove the sub-service ID from the parent service
            await Service.findByIdAndUpdate(
                parentServiceID,
                { $pull: { sub_services: subServiceID } }
            );

            sendResponse(res, 200, "Sub Service deleted successfully", deletedSubService);
        };

        if (subService.sub_service_image) {
            fs.unlink(`uploads/service-picture/${subService.sub_service_image}`, async (error) => {
                if (error) {
                    return next(new ErrorHandler(error.message, 500));
                }
                await deleteSubService();
            });
        } else {
            await deleteSubService();
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// exports.updateSubServiceByID = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const subServiceID = req.params.id;

//         const subServicesData = await SubService.findById(subServiceID);

//         if (!subServicesData) {
//             return next(new ErrorHandler("Sub Services not found!", 400));
//         }

//         const subService = await SubService.findByIdAndUpdate(subServiceID, req.body, {
//             new: true,
//             runValidators: true,
//         })

//         sendResponse(res, 200, "Sub Services Updated successfully", subService);
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });


exports.updateSubServiceByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subServiceID = req.params.id;
        const { parent_service_id } = req.body;

        const subServicesData = await SubService.findById(subServiceID);

        if (!subServicesData) {
            return next(new ErrorHandler("Sub Services not found!", 400));
        }

        const oldParentServiceID = subServicesData.parent_service_id;

        // Update the sub-service
        const subService = await SubService.findByIdAndUpdate(subServiceID, req.body, {
            new: true,
            runValidators: true,
        });

        // If the parent_service_id has changed, update the old and new parent services
        if (parent_service_id && parent_service_id?.toString() !== oldParentServiceID?.toString()) {
            // Remove the sub-service ID from the old parent service
            await Service.findByIdAndUpdate(oldParentServiceID, {
                $pull: { sub_services: subServiceID }
            });

            // Add the sub-service ID to the new parent service
            await Service.findByIdAndUpdate(parent_service_id, {
                $addToSet: { sub_services: subServiceID }
            });
        }

        sendResponse(res, 200, "Sub Services Updated successfully", subService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.updateSubServiceWithPictureByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const subServiceID = req.params.id;

        const subServices = await SubService.findById(subServiceID);

        if (!subServices) {
            return next(new ErrorHandler("Sub Services not found!", 400));
        }

        if (subServices.sub_service_image) {
            fs.unlink(`uploads/service-picture/${subServices.sub_service_image}`, async (error) => {
                if (error) {
                    return next(new ErrorHandler(error.message, 500));
                }

                const deletedSubServices = await SubService.findByIdAndUpdate(subServiceID, { ...req.body, sub_service_image: req.file.filename }, {
                    new: true,
                    runValidators: true,
                });
                sendResponse(res, 200, "Sub Services deleted successfully", deletedSubServices);
            });
        }
        else {
            return next(new ErrorHandler("Old Profile Picture Not Found", 400));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.searchSubServices = catchAsyncErrors(async (req, res, next) => {
    try {

        const searchString = req.params.term;
        const { pageNumber } = req.query;

        const query = {
            $or: [
                { sub_service_name: { $regex: searchString, $options: "i" } },
            ],
        };

        // Execute query
        const totalSubServices = await SubService.countDocuments(query);

        const services = await SubService.find(query)
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15)
            .populate("parent_service_id");

        if (!services.length) {
            return next(
                new ErrorHandler("No sub-services found matching the criteria", 404)
            );
        }

        sendResponse(res, 200, "All sub services fetched successfully.", {
            totalSubServices: totalSubServices,
            totalPages: Math.ceil(totalSubServices / 15),
            currentPage: parseInt(pageNumber, 10),
            services
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});