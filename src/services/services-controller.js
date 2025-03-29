const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const Services = require("./services-model");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const fs = require('fs');
const SubService = require("../sub-services/sub-services-model");
const Profession = require("../profession/profession-model");

// exports.createService = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const newService = await Services.create({ ...req.body, service_image: req.file.filename });
//         sendResponse(res, 200, "Service Created successfully.", newService);
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// })


exports.createService = catchAsyncErrors(async (req, res, next) => {
    try {
        // Create the new service
        const newService = await Services.create({ ...req.body, service_image: req.file.filename });

        // Update the parent_service_id in the sub-services
        if (newService.sub_services && newService.sub_services.length > 0) {
            await SubService.updateMany(
                { _id: { $in: newService.sub_services } },
                { parent_service_id: newService._id }
            );
        }

        sendResponse(res, 200, "Service Created successfully.", newService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// exports.getAllServices = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const { pageNumber } = req.query;
//         const totalServices = await Services.countDocuments();

//         const services = await Services.find({})
//             .populate("sub_services")
//             .sort({ created_at: -1 })
//             .skip((pageNumber - 1) * 15)
//             .limit(15);

//         sendResponse(res, 200, "Services data fetched successfully.", {
//             totalServices: totalServices,
//             totalPages: Math.ceil(totalServices / 15),
//             currentPage: parseInt(pageNumber, 10),
//             services
//         });
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// })


exports.getAllServices = catchAsyncErrors(async (req, res, next) => {
    try {
        // Parse pageNumber and ensure it's a valid integer
        const pageNumber = parseInt(req.query.pageNumber, 10);
        const limit = 15;
        const skip = isNaN(pageNumber) ? 0 : (pageNumber - 1) * limit;

        // Total count of services
        const totalServices = await Services.countDocuments();

        // Aggregation pipeline
        const services = await Services.aggregate([
            // Stage 1: Lookup to join the Review collection
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'service_id',
                    as: 'reviews'
                }
            },
            // Stage 2: Add fields for total count and average rating
            {
                $addFields: {
                    totalReviews: { $size: '$reviews' },
                    averageRating: {
                        $cond: {
                            if: { $gt: [{ $size: '$reviews' }, 0] },
                            then: { $avg: '$reviews.rating' },
                            else: 0
                        }
                    }
                }
            },
            // Stage 3: Sort by created_at field in descending order
            { $sort: { created_at: -1 } },
            // Stage 4: Skip and limit for pagination
            { $skip: skip },
            { $limit: limit },
            // Stage 5: Optionally populate sub_services if needed
            {
                $lookup: {
                    from: 'subservices',
                    localField: 'sub_services',
                    foreignField: '_id',
                    as: 'sub_services'
                }
            }
        ]);

        sendResponse(res, 200, "Services data fetched successfully.", {
            totalServices: totalServices,
            totalPages: Math.ceil(totalServices / limit),
            currentPage: isNaN(pageNumber) ? 1 : pageNumber,
            services
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getServiceByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceID = req.params.id;

        const service = await Services.findById(serviceID);

        sendResponse(res, 200, "Service by id fetched successfully.", service);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

// exports.deleteServiceByID = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const serviceID = req.params.id;
//         const serviceData = await Services.findById(serviceID);

//         if (!serviceData) {
//             return next(new ErrorHandler("Service Not Exist", 400));
//         }

//         if (serviceData.service_image) {
//             fs.unlink(`uploads/service-picture/${serviceData.service_image}`, async (error) => {
//                 if (error) {
//                     return next(new ErrorHandler(error.message, 500));
//                 }

//                 await SubService.deleteMany({ parent_service_id: serviceID });
//                 const deletedServices = await Services.deleteOne({ _id: serviceID });
//                 sendResponse(res, 200, "Services deleted successfully", deletedServices);
//             });
//         } else {
//             await SubService.deleteMany({ parent_service_id: serviceId });
//             const deletedServices = await Services.deleteOne({ _id: serviceID });
//             sendResponse(res, 200, "Services deleted successfully", deletedServices);
//         }
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// })



exports.deleteServiceByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceID = req.params.id;
        const serviceData = await Services.findById(serviceID);

        if (!serviceData) {
            return next(new ErrorHandler("Service Not Exist", 400));
        }

        const deleteServiceAndSubServices = async () => {
            // Update sub-services to remove the reference to the deleted service
            await SubService.updateMany(
                { parent_service_id: serviceID },
                { $unset: { parent_service_id: "" } }
            );

            // Delete the sub-services that reference this service
            await SubService.deleteMany({ parent_service_id: serviceID });

            // Delete the service
            const deletedService = await Services.deleteOne({ _id: serviceID });

            sendResponse(res, 200, "Service deleted successfully", deletedService);
        };

        if (serviceData.service_image) {
            fs.unlink(`uploads/service-picture/${serviceData.service_image}`, async (error) => {
                if (error) {
                    return next(new ErrorHandler(error.message, 500));
                }
                await deleteServiceAndSubServices();
            });
        } else {
            await deleteServiceAndSubServices();
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// exports.updateServiceByID = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const serviceID = req.params.id;

//         const serviceData = await Services.findById(serviceID);
//         if (!serviceData) {
//             return next(new ErrorHandler("Service Not Exist", 400));
//         }

//         const service = await Services.findByIdAndUpdate(serviceID, req.body, {
//             new: true,
//             runValidators: true,
//         })

//         sendResponse(res, 200, "Service Updated Successfully.", service);
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// })


// Update an existing service
exports.updateServiceByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceID = req.params.id;

        const serviceData = await Services.findById(serviceID);
        if (!serviceData) {
            return next(new ErrorHandler("Service Not Exist", 400));
        }

        // Update the service
        const updatedService = await Services.findByIdAndUpdate(serviceID, req.body, {
            new: true,
            runValidators: true,
        });

        // Update the parent_service_id in the sub-services
        if (req.body.sub_services && req.body.sub_services.length > 0) {
            // Remove the parent_service_id from old sub-services that are not in the updated list
            await SubService.updateMany(
                { _id: { $in: serviceData.sub_services }, _id: { $nin: req.body.sub_services } },
                { parent_service_id: null }
            );

            // Add the parent_service_id to the new sub-services
            await SubService.updateMany(
                { _id: { $in: req.body.sub_services } },
                { parent_service_id: updatedService._id }
            );
        }

        sendResponse(res, 200, "Service Updated Successfully.", updatedService);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.updateServiceWithPictureByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const serviceID = req.params.id;

        const serviceData = await Services.findById(serviceID);

        if (!serviceData) {
            return next(new ErrorHandler("Service Not Exist", 400));
        }

        if (serviceData?.service_image) {
            fs.unlink(`uploads/service-picture/${serviceData?.service_image}`, async (error) => {
                if (error) {
                    if (error?.code === "ENOENT") {
                        const service = await Services.findByIdAndUpdate(serviceID, { ...req.body, service_image: req.file.filename }, {
                            new: true,
                            runValidators: true,
                        })
                        sendResponse(res, 200, "Services Updated successfully", service);
                    }
                    else {
                        return next(new ErrorHandler(error.message, 500));
                    }
                }
                else {
                    const service = await Services.findByIdAndUpdate(serviceID, { ...req.body, service_image: req.file.filename }, {
                        new: true,
                        runValidators: true,
                    })
                    sendResponse(res, 200, "Services Updated successfully", service);
                }
            });
        } else {
            return next(new ErrorHandler("Old Profile Picture Not Found", 400));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.searchServices = catchAsyncErrors(async (req, res, next) => {
    try {

        const searchString = req.params.term;
        const { pageNumber } = req.query;

        const query = {
            $or: [
                { service_name: { $regex: searchString, $options: "i" } },
            ],
        };

        // Execute query
        const totalServices = await Services.countDocuments(query);

        const services = await Services.find(query)
            .populate("sub_services")
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        if (!services.length) {
            return next(
                new ErrorHandler("No services found matching the criteria", 404)
            );
        }

        sendResponse(res, 200, "All services fetched successfully.", {
            totalServices: totalServices,
            totalPages: Math.ceil(totalServices / 15),
            currentPage: parseInt(pageNumber, 10),
            services
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.getRandomServices = catchAsyncErrors(async (req, res, next) => {
    try {

        const services = await Services.aggregate([
            { $sample: { size: 15 } },
            {
                $lookup: {
                    from: 'sub_services',
                    localField: 'sub_services',
                    foreignField: '_id',
                    as: 'sub_services'
                }
            }
        ]);

        sendResponse(res, 200, "Radom Services fetched successfully.", services);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getSearch = catchAsyncErrors(async (req, res, next) => {
    try {
        const { value } = req.body;
        console.log('value', value);

        if (!value) {
            return res.status(400).json({ message: 'Search term is required' });
        }

        // Create a case-insensitive regular expression from the search term
        const regex = new RegExp(value, 'i');

        const services = await Services.find({ service_name: { $regex: regex } }).populate("sub_services").select("sub_services");

        const professions = await Profession.find({
            profession_name: { $regex: regex }
        }).select("service_id -_id");

        let matchSubService = [];


        if (professions.length > 0) {
            for (const item of professions) {
                matchSubService = await Services.find(item.service_id).populate("sub_services").select("sub_services");
            }
        }

        const subservices = await SubService.find({ sub_service_name: { $regex: regex } });

        console.log('sub serivsdlk', subservices);

        if (services.length > 0) {
            return sendResponse(res, 200, "Search results fetched successfully", services);
        }
        else if (matchSubService.length > 0) {
            return sendResponse(res, 200, "Search results fetched successfully", matchSubService)
        }
        else {
            return sendResponse(res, 200, "subService", subservices)
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
