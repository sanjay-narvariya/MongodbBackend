const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Booking = require("./booking-model");
const Customer = require("../customer/customer-model");
const Vendor = require("../vendor/vendor-model");
const Services = require("../services/services-model");
const Refund = require("../refund/refund-model");
const BookingsCompleted = require("../booking-completed/booking-completed-model");
const MembershipPurchased = require("../membership-purchased/membership-purchased-model");

const { sendBookingConfirmationToAdmin, sendBookingConfirmationToCustomer } = require("../../utils/mail");
const ShortUniqueId = require("short-unique-id");

const moment = require('moment');
const { sendNotificationsToVendors } = require("./booking-helper");


exports.createBooking = catchAsyncErrors(async (req, res, next) => {
    try {
        const { service_id, service_date, service_time, user_data, is_pod, remaining_amount, paid_amount, booking_date, billing_info } = req.body;

        const uniqueNumId = new ShortUniqueId({ length: 4, dictionary: "number" });
        const uniqueAlpId = new ShortUniqueId({ length: 3, dictionary: "alpha_upper" });

        const currentUniqueId = uniqueNumId.rnd();
        const currentAlpId = uniqueAlpId.rnd();

        const booking_id = `NV${currentUniqueId}${currentAlpId}`

        // const newBooking = await Booking.create(req.body);
        const newBooking = await Booking.create({
            ...req.body,
            booking_id,
            timestamp: Date.now()
        });

        const service_name = await Services.find({
            _id: service_id
        }).select("service_name -_id");

        const serviceNames = service_name.map(service => service.service_name);

        let admin_mail_data = {
            serviceNames: serviceNames,
            serviceTime: service_time,
            serviceDate: service_date,
            pod: is_pod,
            remaining_amount,
            paid_amount,
            serviceAddress: `${billing_info?.street}, ${billing_info?.zip_code}, ${billing_info?.city}, ${billing_info?.state}`,
            bookingDate: booking_date
        };

        let mail_data = {
            customerEmail: billing_info?.email,
            customerName: billing_info?.full_name,
            serviceNames: serviceNames,
            serviceTime: service_time,
            serviceDate: service_date,
            pod: is_pod,
            remaining_amount,
            paid_amount,
            serviceAddress: `${billing_info?.street}, ${billing_info?.zip_code}, ${billing_info?.city}, ${billing_info?.state}`,
            bookingDate: booking_date
        };



        await sendBookingConfirmationToAdmin(admin_mail_data);

        await sendBookingConfirmationToCustomer(mail_data);

        await sendNotificationsToVendors(newBooking?.vendors, newBooking)

        sendResponse(res, 200, "Booking Created Successfully", newBooking);

    } catch (error) {
        console.log('erroror', error);
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.onSiteBooking = catchAsyncErrors(async (req, res, next) => {
    try {
        const { service_id, sub_service_id, is_pod, remaining_amount, paid_amount, customer_id } = req.body;

        const latestBooking = await Booking.find({
            customer_id
        })
            .sort({ created_at: -1 })
            .limit(1);

        const vendors = [];

        console.log('latestBooking[0]', latestBooking[0])

        latestBooking[0]?.vendors?.map((item) => {
            if (service_id.includes(item?.service_id.toString())) {
                vendors.push({ service_id: item?.service_id, vendor_id: item?.vendor_id })
            }
        });

        if (vendors.length === 0) {
            return next(new ErrorHandler("On site Vendor not found", 500));
        }

        const uniqueNumId = new ShortUniqueId({ length: 4, dictionary: "number" });
        const uniqueAlpId = new ShortUniqueId({ length: 3, dictionary: "alpha_upper" });

        const currentUniqueId = uniqueNumId.rnd();
        const currentAlpId = uniqueAlpId.rnd();

        const booking_id = `NV${currentUniqueId}${currentAlpId}`;

        const { service_date, service_time, billing_info } = latestBooking[0];


        const newBooking = await Booking.create({
            service_date,
            service_time,
            billing_info,
            customer_id,
            service_id,
            remaining_amount,
            on_site: true,
            paid_amount,
            sub_service_id,
            is_pod,
            booking_date: new Date(),
            booking_id,
            vendors: vendors,
            timestamp: Date.now()
        });

        // const service_name = await Services.find({
        //     _id: service_id
        // }).select("service_name -_id");

        // const serviceNames = service_name.map(service => service.service_name);

        // let admin_mail_data = {
        //     serviceNames: serviceNames,
        //     serviceTime: service_time,
        //     serviceDate: service_date,
        //     pod: is_pod,
        //     remaining_amount,
        //     paid_amount,
        //     serviceAddress: `${billing_info?.street}, ${billing_info?.zip_code}, ${billing_info?.city}, ${billing_info?.state}`,
        //     bookingDate: booking_date
        // };

        // let mail_data = {
        //     customerEmail: user_data?.email,
        //     customerName: user_data?.full_name,
        //     serviceNames: serviceNames,
        //     serviceTime: service_time,
        //     serviceDate: service_date,
        //     pod: is_pod,
        //     remaining_amount,
        //     paid_amount,
        //     serviceAddress: `${billing_info?.street}, ${billing_info?.zip_code}, ${billing_info?.city}, ${billing_info?.state}`,
        //     bookingDate: booking_date
        // };

        // await sendBookingConfirmationToAdmin(admin_mail_data);

        // await sendBookingConfirmationToCustomer(mail_data);

        sendResponse(res, 200, "Booking Created Successfully", newBooking);

    } catch (error) {
        console.log('erroror', error);
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getBookingByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const bookingID = req.params.id;
        const booking = await Booking.findById(bookingID).populate('customer_id')
            .populate('service_id')
            .populate('sub_service_id')

        sendResponse(res, 200, "Booking Data Fetched Successfully", booking);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.getBookedServicesByCustomer = catchAsyncErrors(async (req, res, next) => {
    try {
        const customerID = req.params.customerid;

        // Fetch bookings for the specified customer and select only sub_service_id field
        const bookings = await Booking.find({ customer_id: customerID })
            .select('sub_service_id')
            .lean(); // Convert MongoDB documents to plain JavaScript objects

        // Extract sub_service_id from bookings
        const subServiceIds = bookings.flatMap(booking => booking.sub_service_id);

        sendResponse(res, 200, "Booking By Customer Data Fetched Successfully", subServiceIds);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.updateBookingByID = catchAsyncErrors(async (req, res, next) => {
    try {
        const bookingID = req.params.id;

        const booking = await Booking.findByIdAndUpdate(bookingID, req.body, {
            new: true,
            runValidators: true,
        });

        if (!booking) {
            return next(new ErrorHandler("Booking not found!", 400));
        }

        sendResponse(res, 200, "Booking Updated Successfully", booking);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getAllBookingsByCityAndDate = catchAsyncErrors(async (req, res, next) => {
    try {
        const { city, from, to } = req.body;

        if (!from || !to || !city) {
            return res.status(400).json({ error: 'City, From and To dates are required' });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999); // End of the 'to' day

        // Fetch customers in the specified city
        const customers = await Customer.find({ 'address.city': city }).select('_id');

        if (!customers.length) {
            return res.status(404).json({ error: 'No customers found in the specified city' });
        }

        const customerIds = customers.map(customer => customer._id);

        // Fetch bookings for those customers within the specified date range
        const bookings = await Booking.find({
            customer_id: { $in: customerIds },
            booking_date: {
                $gte: fromDate,
                $lte: toDate
            },
            booking_status: 'completed'
        });

        // Calculate total sales
        const totalSales = bookings.reduce((sum, booking) => sum + booking.total_amount, 0);

        // Format the response
        const responseData = bookings.map(booking => ({
            totalSales: booking.total_amount,
            fromDate: fromDate.toISOString().split('T')[0],
            toDate: toDate.toISOString().split('T')[0],
            city: city
        }));

        sendResponse(res, 200, "Data fetched successfully", responseData);

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// exports.getAllBookingsByCityAndDate = catchAsyncErrors(async (req, res, next) => {
//     try {
//         const { city, from, to } = req.body;

//         if (!from || !to || !city) {
//             return res.status(400).json({ error: 'City, From and To dates are required' });
//         }

//         const fromDate = new Date(from);
//         const toDate = new Date(to);
//         toDate.setHours(23, 59, 59, 999); // End of the 'to' day

//         // Fetch customers in the specified city
//         const customers = await Customer.find({ 'address.city': city }).select('_id');

//         if (!customers.length) {
//             return res.status(404).json({ error: 'No customers found in the specified city' });
//         }

//         const customerIds = customers.map(customer => customer._id);

//         // Fetch bookings for those customers within the specified date range
//         const bookings = await Booking.find({
//             customer_id: { $in: customerIds },
//             booking_date: {
//                 $gte: fromDate,
//                 $lte: toDate
//             },
//             booking_status: 'completed'
//         }).select('_id');

//         if (!bookings.length) {
//             return res.status(404).json({ error: 'No bookings found in the specified date range' });
//         }

//         const bookingIds = bookings.map(booking => booking._id);

//         // Fetch completed bookings from the BookingCompleted model
//         const completedBookings = await BookingsCompleted.find({
//             booking_id: { $in: bookingIds }
//         });

//         // Calculate total sales based on the total_amount of completed services
//         const totalSales = completedBookings.reduce((sum, booking) => {
//             const completedServicesAmount = booking.completed_services.reduce((serviceSum, service) => serviceSum + service.total_amount, 0);
//             return sum + completedServicesAmount;
//         }, 0);

//         // Format the response
//         const responseData = completedBookings.map(booking => ({
//             // totalSales: booking.completed_services.reduce((serviceSum, service) => serviceSum + service.total_amount, 0),
//             totalSales,
//             fromDate: fromDate.toISOString().split('T')[0],
//             toDate: toDate.toISOString().split('T')[0],
//             city: city
//         }));

//         sendResponse(res, 200, "Data fetched successfully", responseData);

//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });



// exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
//     try {

//         // const completedBookings = await Booking.find({ booking_status: 'completed' });
//         const completedBookings = await BookingsCompleted.find({});

//         const allRefunds = await Refund.find({});

//         // Calculate total sales based on the total_amount of completed services
//         const totalSales = completedBookings.reduce((sum, booking) => {
//             const completedServicesAmount = booking.completed_services.reduce((serviceSum, service) => serviceSum + service.total_amount, 0);
//             return sum + completedServicesAmount;
//         }, 0);

//         const amountRefunded = allRefunds.reduce((sum, refund) => sum + refund.refund_amount, 0);

//         // Fetch customer and vendor counts
//         const customerCount = await Customer.countDocuments();
//         const membershipCustomerCount = await MembershipPurchased.countDocuments();
//         const vendorCount = await Vendor.countDocuments();
//         const successfullBookings = completedBookings?.length;

//         // Send response with the statistics
//         sendResponse(res, 200, 'Dashboard statistics fetched successfully', { totalSales, customerCount, vendorCount, successfullBookings, amountRefunded, membershipCustomerCount });
//     } catch (error) {
//         return next(new ErrorHandler(error.message, 500));
//     }
// });


exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
    try {

        const completedBookings = await Booking.find({ booking_status: 'completed' });

        // Calculate total sales based on the total_amount
        const totalSales = completedBookings.reduce((sum, booking) => sum + booking.total_amount, 0);

        const allRefunds = await Refund.find({});

        const amountRefunded = allRefunds.reduce((sum, refund) => sum + refund.refund_amount, 0);
        // Fetch customer and vendor counts
        const customerCount = await Customer.countDocuments();
        const membershipCustomerCount = await MembershipPurchased.countDocuments();
        const vendorCount = await Vendor.countDocuments();
        const successfullBookings = completedBookings?.length;

        // Send response with the statistics
        sendResponse(res, 200, 'Dashboard statistics fetched successfully', { totalSales, customerCount, vendorCount, successfullBookings, amountRefunded, membershipCustomerCount });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getLatestBookings = catchAsyncErrors(async (req, res, next) => {
    try {
        const latestBookings = await Booking.find()
            .limit(3)
            .sort({ created_at: -1 })
            .populate({
                path: 'customer_id',
                select: 'full_name address',
                populate: {
                    path: 'address',
                    match: { '0.city': { $exists: true } },
                    select: 'city'
                }
            })
            .select('service_id service_date service_time')

        // Map the latestBookings to include only the required fields
        const formattedBookings = await Promise.all(latestBookings.map(async (booking) => {
            // Fetch the service name
            const service = await Services.findById(booking.service_id).select('service_name');
            return {
                customer_name: booking?.customer_id?.full_name,
                service_name: service ? service.service_name : 'Unknown Service',
                createdAt: booking?.created_at,
                city: booking?.customer_id?.address[0]?.city,
                service_time: booking?.service_time,
                service_date: booking?.service_date
            };
        }));

        sendResponse(res, 200, 'Latest bookings fetched successfully', formattedBookings);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


// exports.getBookingsOfCurrentMonth = catchAsyncErrors(async (req, res, next) => {
exports.getBookingsOfCurrentMonth = catchAsyncErrors(async (req, res, next) => {
    try {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const bookings = await Booking.aggregate([
            {
                $match: {
                    booking_date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: '$booking_status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const groupedCounts = {
            scheduled: 0,
            completed: 0,
            cancelled: 0
        };

        bookings.forEach(booking => {
            if (booking._id === 'scheduled') {
                groupedCounts.scheduled = booking.count;
            } else if (booking._id === 'completed') {
                groupedCounts.completed = booking.count;
            } else if (booking._id === 'cancelled') {
                groupedCounts.cancelled = booking.count;
            }
        });

        sendResponse(res, 200, 'Current month bookings count fetched successfully', groupedCounts);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getAllSales = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const totalBookings = await Booking.countDocuments();

        const bookings = await Booking.find({})
            .populate({
                path: 'customer_id',
                select: 'full_name phone'
            })
            .populate({
                path: 'service_id',
                select: 'service_name'
            })
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "Booking Data Fetched Successfully", {
            totalSales: totalBookings,
            totalPages: Math.ceil(totalBookings / 15),
            currentPage: parseInt(pageNumber, 10),
            bookings,
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.getAllBookings = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber = 1 } = req.query; // Default to page 1 if pageNumber is not provided
        const totalBookings = await Booking.countDocuments();

        const bookings = await Booking.find({})
            .populate({
                path: 'customer_id',
                select: 'full_name email phone address'
            })
            .populate({
                path: 'sub_service_id.id',
                select: 'sub_service_name description'
            })
            .populate('service_id')
            .populate('vendors.vendor_id')
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "Booking Data Fetched Successfully", {
            totalBookings: totalBookings,
            totalPages: Math.ceil(totalBookings / 15),
            currentPage: parseInt(pageNumber, 10),
            bookings
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.getBookingByCustomerID = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber = 1 } = req.query;
        const customerID = req.params.customerid;

        // Count the total number of bookings for the specific customer
        const totalBookings = await Booking.countDocuments({ customer_id: customerID });

        // Fetch the bookings for the specific customer with pagination
        const bookings = await Booking.find({ customer_id: customerID })
            .populate('customer_id')
            .populate('service_id')
            .populate({
                path: 'sub_service_id.id',
                select: 'sub_service_name description'
            })
            .populate('vendors.vendor_id')
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        // Send the response
        sendResponse(res, 200, "Booking By Customer Data Fetched Successfully", {
            totalBookings: totalBookings,
            totalPages: Math.ceil(totalBookings / 15),
            currentPage: parseInt(pageNumber, 10),
            bookings
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});



exports.getBookingByVendorID = catchAsyncErrors(async (req, res, next) => {
    try {
        const { pageNumber } = req.query;
        const vendorID = req.params.vendorid;

        const totalBookings = await Booking.countDocuments({
            'vendors.vendor_id': vendorID
        });

        const bookings = await Booking.find({
            'vendors.vendor_id': vendorID
        })
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15)
            .populate({
                path: 'sub_service_id.id',
                select: 'sub_service_name',
            })

        if (!bookings) {
            return res.status(404).json({ message: 'No bookings found for this vendor.' });
        }

        sendResponse(res, 200, "Booking By Customer Data Fetched Successfully", {
            totalBookings: totalBookings,
            totalPages: Math.ceil(totalBookings / 15),
            currentPage: parseInt(pageNumber, 10),
            bookings
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.searchBookings = catchAsyncErrors(async (req, res, next) => {
    try {

        const searchString = req.params.term;
        const { pageNumber } = req.query;

        const query = {
            $or: [
                { 'billing_info.city': { $regex: searchString, $options: 'i' } },
                { 'billing_info.full_name': { $regex: searchString, $options: 'i' } },
                { booking_id: { $regex: searchString, $options: 'i' } },
                { service_time: { $regex: searchString, $options: 'i' } },
            ],
        };

        const totalBookings = await Booking.countDocuments(query);

        const bookings = await Booking.find(query)
            .populate({
                path: 'customer_id',
                select: 'full_name',
            })
            .populate('service_id')
            .populate('sub_service_id')
            .populate('vendors.vendor_id')
            .sort({ created_at: -1 })
            .skip((pageNumber - 1) * 15)
            .limit(15);

        sendResponse(res, 200, "All Bookings fetched successfully.", {
            totalBookings: totalBookings,
            totalPages: Math.ceil(totalBookings / 15),
            currentPage: parseInt(pageNumber, 10),
            bookings
        });

        // sendResponse(res, 200, 'Bookings fetched successfully', bookings);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
