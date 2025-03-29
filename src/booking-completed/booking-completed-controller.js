const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendResponse = require("../../middleware/response");
const ErrorHandler = require("../../utils/ErrorHandler");
const Booking = require("../booking/booking-model");
const Vendor = require("../vendor/vendor-model");
const BookingCompleted = require("./booking-completed-model");

exports.createBookingCompleted = catchAsyncErrors(async (req, res, next) => {
    try {
        const { booking_id, completed_services, incompleted_services } = req.body;

        var filenames = req.files.map((file) => file.filename).join(",");

        // const completedservice = JSON.parse(completed_services);
        // const incompletedservice = JSON.parse(incompleted_services);

        const completedservice = completed_services;
        
        const newBookingCompleted = await BookingCompleted.create({ ...req.body, photos: filenames });

        // const newBookingCompleted = await BookingCompleted.create({ ...req.body, completed_services: completedservice, incompleted_services: incompletedservice, photos: filenames });


        // if (completedservice && completedservice.length > 0) {
        //     // const completedservice = completed_services;

        //     const newBookingCompleted = await BookingCompleted.create({ ...req.body, completed_services: completedservice, photos: filenames });
        // }
        // else {
        // const incompletedservice = JSON.parse(incompleted_services)

        // const newBookingCompleted = await BookingCompleted.create({ ...req.body, photos: filenames });
        // }

        const booking = await Booking.findById(booking_id);
        const { service_time } = booking;

        if (!booking) {
            return next(new ErrorHandler("Booking not found!", 400));
        }

        booking.booking_status = "completed";

        await booking.save();

        if (completedservice && completedservice?.length > 0) {
            for (const completedService of completedservice) {
                if (completedService?.vendor_id) {
                    const vendor = await Vendor.findById(completedService?.vendor_id);

                    if (!vendor) {
                        return next(new ErrorHandler("Vendor not found", 400));
                    }

                    const commission = vendor?.commission;
                    const total_amount = completedService?.total_amount;
                    const vendor_earning = (total_amount * commission) / 100;

                    vendor.slots = vendor.slots.map(slot => {
                        if (slot?.slot_name === service_time) {
                            return { ...slot, is_available: true };
                        }
                        return slot;
                    });

                    vendor.total_earnings.push({ earnings: vendor_earning, date: new Date() })

                    await vendor.save();
                }
                else {
                    return next(new ErrorHandler("Vendor ID not found", 500));
                }
            }
        }

        sendResponse(res, 200, "Booking Completed Successfully", newBookingCompleted);
    } catch (error) {
        // console.log('booking completed errro :  ', error);
        return next(new ErrorHandler(error.message, 500));
    }
});


exports.getBookingCompletedByID = catchAsyncErrors(async (req, res, next) => {
    try {

        const bookingCompletedID = req.params.id;

        const newBookingCompleted = await BookingCompleted.findById(bookingCompletedID);

        if (!newBookingCompleted) {
            return next(new ErrorHandler("Booking Not Found!", 400));
        }

        sendResponse(res, 200, "Booking Completed Successfully", newBookingCompleted);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.getBookingCompletedByBookingID = catchAsyncErrors(async (req, res, next) => {
    try {
        const bookingID = req.params.id;

        const completedBookingData = await BookingCompleted.findOne({
            booking_id: bookingID
        })
            .populate({
                path: 'completed_services.sub_services',
            })
            .populate({
                path: 'incompleted_services.sub_services',
            });

        if (!completedBookingData) {
            return next(new ErrorHandler("Booking Not Found!", 400));
        }

        sendResponse(res, 200, "Booking Completed Successfully", completedBookingData);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
