const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Vendor = require("./vendor-model");
const Slot = require("../slot/slot-model");
const fs = require('fs');
const ShortUniqueId = require("short-unique-id");
const sendToken = require("../../utils/jwtToken");
const Services = require("../services/services-model");
const mongoose = require('mongoose');
const { sendOtpSuperAdmin, sendBookingConfirmationToCustomer } = require("../../utils/mail");
const Booking = require("../booking/booking-model");
const moment = require("moment");
const Review = require("../reviews/reviews-model");

exports.createVendor = catchAsyncErrors(async (req, res, next) => {
    try {
        const { phone } = req.body;

        const vendor = await Vendor.findOne({ phone });

        if (vendor) {
            return next(new ErrorHandler("User already exists", 400));
        }

        const slots = await Slot.find({});

        const slotData = slots.map(slot => ({
            slot_id: slot._id,
            slot_name: slot.from,
            is_available: true
        }));

        const newVendor = await Vendor.create({ ...req.body, slots: slotData });
        sendResponse(res, 200, "Vendor Created Successfully", newVendor);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getAllVendors = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const totalVendors = await Vendor.countDocuments();

        const vendor = await Vendor.find({})
            .populate("profession_id")
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);;

        sendResponse(res, 200, "Vendor Fetched Successfully", {
            totalVendors: totalVendors,
            totalPages: Math.ceil(totalVendors / 15),
            currentPage: parseInt(pageNumber, 10),
            vendor
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.getVendorByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;
        const vendor = await Vendor.findById(vendorID);

        sendResponse(res, 200, "Vendor Data Fetched Successfully", vendor);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.deleteVendorByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;

        const vendorData = await Vendor.findById(vendorID);
        if (!vendorData) {
            return next(new ErrorHandler("Vendor not found", 400));
        }

        const vendor = await Vendor.deleteOne({ _id: vendorID });

        sendResponse(res, 200, "Vendor deleted successfully", vendor);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})

exports.updateVendorByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;

        const vendor = await Vendor.findByIdAndUpdate(vendorID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!vendor) {
            return next(new ErrorHandler("Vendor not found!", 400));
        }

        sendResponse(res, 200, "Vendor Data Fetched Successfully", vendor);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.createProfilePicture = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;

        const vendor = await Vendor.findByIdAndUpdate(vendorID, { "profile_picture": req.file.filename }, {
            new: true,
            runValidators: true,
        });

        if (!vendor) {
            return next(new ErrorHandler("Vendor doesn't exists!", 400));
        }

        sendResponse(res, 200, "Profile Picture Uploaded successfully", vendor);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.deleteProfilePictureByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;

        let vendorData = await Vendor.findById(vendorID);

        if (!vendorData) {
            return next(new ErrorHandler("Vendor doesn't exists!", 400));
        }

        if (vendorData.profile_picture) {
            fs.unlinkSync(`uploads/vendor-picture/${vendorData.profile_picture}`)

            const response = await Vendor.findByIdAndUpdate(vendorID, { "profile_picture": "" }, {
                new: true,
                runValidators: true,
            });

            sendResponse(res, 200, "Profile Picture Deleted successfully", response);
        }
        else {
            return next(new ErrorHandler("Profile Picture Not yet Uploaded by Vendor", 400));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}); 

exports.updateProfilePictureByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorID = req.params.id;

        let vendorData = await Vendor.findById(vendorID);

        if (!vendorData) {
            return next(new ErrorHandler("Vendor doesn't exists!", 400));
        }


        if (vendorData.profile_picture) {
            fs.unlinkSync(`uploads/vendor-picture/${vendorData.profile_picture}`)

            const vendor = await Vendor.findByIdAndUpdate(vendorID, { "profile_picture": req.file.filename }, {
                new: true,
                runValidators: true,
            });

            if (!vendor) {
                return next(new ErrorHandler("Vendor doesn't exists!", 400));
            }

            sendResponse(res, 200, "Vendor Profile Picture Updated successfully", vendor);
        }
        else {
            fs.unlinkSync(`uploads/profile-picture/${req.file.filename}`)
            return next(new ErrorHandler("Profile Picture Not yet Uploaded by Vendor", 400));
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.sendOtpForPhone = catchAsyncErrors(async (req, res, next) => {
    try {
        const { phone, device_type, device_token } = req.body;

        const uniqueId = new ShortUniqueId({ length: 4, dictionary: "number" });
        const currentUniqueId = uniqueId.rnd();

        const vendor = await Vendor.findOne({ phone });

        if (!vendor) {
            return res.status(404).json({ status: false, message: "Vendor Not Found" })
            // return next(new ErrorHandler("Customer not found", 404));
        }

        if (!vendor.is_active) {
            return res.status(500).json({ status: false, message: "Number is not active" });
        }

        vendor.otp = currentUniqueId;
        vendor.device_type = device_type;
        vendor.device_token = device_token;
        await vendor.save();

        sendResponse(res, 200, "otp sent successfully.", currentUniqueId);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

exports.verifyOtpForPhone = catchAsyncErrors(async (req, res, next) => {
    try {
        const { phone, otp } = req.body;

        // Find the Customer by email
        const vendor = await Vendor.findOne({ phone })

        if (!vendor) {
            return next(new ErrorHandler("Vendor not found", 404));
        }

        // Check if the OTP matches
        if (vendor.otp !== otp) {
            return next(new ErrorHandler("OTP didn't match, please try again", 400));
        }

        // Update the Cutomer to clear the OTP
        vendor.otp = "";
        await vendor.save();

        // Send the response with the updated sub-admin
        sendToken(vendor, 200, res, "Vendor Phone verification successful");
        // sendResponse(res, 200, "Customer Phone verification successful", customer);
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});

// const vendors = await Vendor.find({
//     profession_id: service,
//     address: {
//         $elemMatch: { city: city }
//     },
//     slots: {
//         $elemMatch: { slot_name: service_time, is_available: true }
//     }
// })

exports.searchVendor = catchAsyncErrors(async (req, res, next) => {
    try {
        const { services, service_time, city, isChecked } = req.body;

        let vendorsList = [];
        let vendorByService = [];

        for (const service of services) {
            const vendors = await Vendor.aggregate([
                {
                    $lookup: {
                        from: 'professions',
                        localField: 'profession_id',
                        foreignField: '_id',
                        as: 'profession'
                    }
                },
                {
                    $unwind: '$profession'
                },
                {
                    $match: {
                        'profession.service_id': new mongoose.Types.ObjectId(service),
                        'address.city': city,
                        'slots': {
                            $elemMatch: {
                                slot_name: service_time,
                                is_available: true
                            }
                        },
                        'at_work': true
                    }
                }
            ]);

            if (vendors.length === 0 && isChecked) {
                return res.status(200).json({ status: false, message: `Currently Our Vendors are not available for the ${service_time} slot` });
            }

            if (vendors.length > 0) {
                vendorsList = vendorsList.concat(vendors);
            }
            //     let filteredVendors = filterVendorsByDistance(vendorsList, latitude, longitude, 10);
            //     console.log('filteredVendors => ', filteredVendors)

            //     if (filteredVendors.length === 0) {
            //         filteredVendors = filterVendorsByDistance(vendorsList, latitude, longitude, 20);
            //     }
            //     if (filteredVendors.length === 0) {
            //         filteredVendors = filterVendorsByDistance(vendorsList, latitude, longitude, 30);
            //     }

            //     vendorsList = filteredVendors;

            if (vendorsList.length > 0) {
                vendorByService = [...vendorByService, { [service]: vendorsList }];
            }
            // }
            vendorsList = [];
        }

        return res.status(200).json({ status: true, data: vendorByService });

        // Helper function to filter vendors by distance
        // function filterVendorsByDistance(vendors, latitude, longitude, radius) {
        //     return vendors.filter(vendor => {
        //         const [vendorLatitude, vendorLongitude] = [vendor.address[0].latitude, vendor.address[0].longitude];
        //         const distance = haversineDistance([latitude, longitude], [vendorLatitude, vendorLongitude]);
        //         console.log(`Distance between [${latitude}, ${longitude}] and [${vendorLatitude}, ${vendorLongitude}] is ${distance} km`);
        //         return distance <= radius;
        //     });
        // }

        // // Helper function to calculate distance between two coordinates in kilometers
        // function haversineDistance(coords1, coords2) {
        //     function toRad(x) {
        //         return x * Math.PI / 180;
        //     }

        //     const [lat1, lon1] = coords1;
        //     const [lat2, lon2] = coords2;

        //     const R = 6371; // Radius of Earth in kilometers
        //     const dLat = toRad(lat2 - lat1);
        //     const dLon = toRad(lon2 - lon1);
        //     const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        //         Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        //         Math.sin(dLon / 2) * Math.sin(dLon / 2);
        //     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        //     return R * c;
        // }

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.searchVendors = catchAsyncErrors(async (req, res, next) => {
    try {
        const searchString = req.params.term;
        const { pageNumber = 1 } = req.query;

        const pipeline = [
            {
                $lookup: {
                    from: "professions", // The name of your Profession collection
                    localField: "profession_id",
                    foreignField: "_id",
                    as: "profession_id"
                }
            },
            {
                $unwind: "$profession_id" // Flatten the profession array
            },
            {
                $match: {
                    $or: [
                        { full_name: { $regex: searchString, $options: "i" } },
                        { phone: { $regex: searchString, $options: "i" } },
                        { address: { $elemMatch: { city: { $regex: searchString, $options: "i" } } } },
                        { "profession_id.profession_name": { $regex: searchString, $options: "i" } }
                    ]
                }
            },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $sort: { created_at: -1 } },
                        { $skip: (pageNumber - 1) * 15 },
                        { $limit: 15 }
                    ]
                }
            }
        ];

        const result = await Vendor.aggregate(pipeline);
        const totalVendors = result[0].metadata[0] ? result[0].metadata[0].total : 0;
        const vendors = result[0].data;

        if (!vendors.length) {
            return next(
                new ErrorHandler("No vendors found matching the criteria", 404)
            );
        }

        // Prepare response with populated profession data
        sendResponse(res, 200, "All vendors fetched successfully.", {
            totalVendors: totalVendors,
            totalPages: Math.ceil(totalVendors / 15),
            currentPage: parseInt(pageNumber, 10),
            vendor: vendors
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.assignVendor = catchAsyncErrors(async (req, res, next) => {
    try {
        const { vendor_id } = req.body;
        const booking_id = req.params.booking_id;

        const booking = await Booking.findOne({ _id: booking_id });

        if (!booking) {
            return next(
                new ErrorHandler("Booking not found", 404)
            );
        }

        const vendor = await Vendor.findById(vendor_id).populate("profession_id");


        if (!vendor) {
            return next(
                new ErrorHandler("Vendor not found", 404)
            );
        }

        booking.vendors.map((item) => {
            if (!item.vendor_id) {
                if (item.service_id.equals(vendor.profession_id.service_id)) {
                    item.vendor_id = vendor_id;
                }
            }
            else {
                return sendResponse(res, 200, "Vendor already assigned!", booking);
            }
        });

        await booking.save();

        for (let slot of vendor.slots) {
            if (slot.slot_name === booking.service_time) {
                slot.is_available = false;
            }
        }

        await vendor.save();

        return sendResponse(res, 200, "Vendor assigned successfully", []);


        // if (booking.vendors.length === 0) {
        //     const vendor = await Vendor.findById(vendor_id);

        //     booking.vendors = [vendor_id];

        //     await booking.save();

        //     if (!vendor) {
        //         return next(
        //             new ErrorHandler("Vendor not found", 404)
        //         );
        //     }

        //     for (let slot of vendor.slots) {
        //         if (slot.slot_name === booking.service_time) {
        //             slot.is_available = false;
        //         }
        //     }

        //     await vendor.save();

        //     sendResponse(res, 200, "Vendor updated successfully", []);
        // }
        // else {
        //     sendResponse(res, 200, "Booking already has vendors assigned", booking);
        // }

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.getVendorByService = catchAsyncErrors(async (req, res, next) => {
    try {
        const { services, city } = req.body;

        const vendorList = [];

        for (const service of services) {
            const vendors = await Vendor.aggregate([
                {
                    $lookup: {
                        from: 'professions',
                        localField: 'profession_id',
                        foreignField: '_id',
                        as: 'profession'
                    }
                },
                {
                    $unwind: '$profession'
                },
                {
                    $match: {
                        'profession.service_id': new mongoose.Types.ObjectId(service),
                        'address.city': city,
                    }
                }
            ]);

            vendorList.push({ [service]: vendors });
        }


        sendResponse(res, 200, "Vendor Data Fetched Successfully", vendorList);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
})


exports.assignVendorByAdmin = catchAsyncErrors(async (req, res, next) => {
    try {
        const { vendors } = req.body;
        const booking_id = req.params.booking_id;

        const booking = await Booking.findOne({ _id: booking_id });

        if (!booking) {
            return next(
                new ErrorHandler("Booking not found", 404)
            );
        }

        const vendorData = Object.values(vendors)

        for (const vendorId of vendorData) {

            const vendor = await Vendor.findById(vendorId).populate("profession_id");

            for (let slot of vendor.slots) {
                if (slot.slot_name === booking.service_time) {
                    slot.is_available = false;
                }
            }

            await vendor.save();

            booking.vendors.map((item) => {
                if (!item.vendor_id) {
                    if (item.service_id.equals(vendor.profession_id.service_id)) {
                        item.vendor_id = vendorId;
                    }
                }
            });

        }

        await booking.save();

        return sendResponse(res, 200, "Vendor Assign successfully", booking);

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


exports.getExportedVendorData = catchAsyncErrors(async (req, res, next) => {
    const days = parseInt(req.body.days);

    try {
        let query = {};

        if (days !== 0) {
            const date = new Date();
            date.setDate(date.getDate() - days);
            query.created_at = { $gte: date };
        }

        const vendors = await Vendor.find(query);
        sendResponse(res, 200, "All vendors fetched successfully.", vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

exports.getLastMonthEarnings = catchAsyncErrors(async (req, res, next) => {
    try {
        const vendorId = req.params.id;

        const startOfLastMonth = moment().subtract(1, 'month').startOf('month').toDate();
        const endOfLastMonth = moment().subtract(1, 'month').endOf('month').toDate();

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            throw new Error('Vendor not found');
        }

        const reviewStats = await Review.aggregate([
            { $match: { vendor_id: new mongoose.Types.ObjectId(vendorId) } },
            {
                $group: {
                    _id: null,
                    totalReviews: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);

        // Extract statistics
        const totalReviews = reviewStats.length > 0 ? reviewStats[0].totalReviews : 0;
        const averageRating = reviewStats.length > 0 ? reviewStats[0].averageRating : 0;


        const lastMonthEarnings = vendor.total_earnings.filter(earning => {
            return earning.date >= startOfLastMonth && earning.date <= endOfLastMonth;
        });

        const LastMonthtotalEarnings = lastMonthEarnings.reduce((sum, earning) => sum + earning.earnings, 0);

        const totalEarning = vendor.total_earnings.reduce((sum, earning) => sum + earning.earnings, 0)

        const totalBookingCompleted = vendor.total_earnings.length;

        sendResponse(res, 200, "Last month's earnings fetched successfully", { commission: vendor?.commission, totalReviews, averageRating, LastMonthtotalEarnings, totalEarning, totalBookingCompleted });

    } catch (error) {
        console.log('error r', error)
        next(new ErrorHandler(error.message, 500));
    }
});


// exports.getLastMonthEarning = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const vendors = await Vendor.find(query);
//         sendResponse(res, 200, "All vendors fetched successfully.", vendors);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });