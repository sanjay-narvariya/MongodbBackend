// const cron = require('node-cron');
// const moment = require('moment');
// const { assignVendor } = require('../../utils/mail');
// const Booking = require("../booking/booking-model");

// const checkAllBookingsVendors = async () => {
//     try {
//         // Find bookings where vendor_id is null and emailSent is false
//         const bookings = await Booking.find({
//             'vendors.vendor_id': { $exists: true, $eq: null }, // or { $eq: "" } if empty string
//             email_sent: false
//         });

//         const unassignedBookings = bookings.filter(booking => {
//             const threeHoursAgo = moment().subtract(3, 'hours');
//             return moment(booking.created_at).isBefore(threeHoursAgo);
//         });

//         if (unassignedBookings.length > 0) {
//             // console.log('Found unassigned bookings:', unassignedBookings);

//             for (let booking of unassignedBookings) {
//                 try {
//                     await assignVendor(booking);

//                     booking.email_sent = true;
//                     await booking.save();
//                 } catch (error) {
//                     // console.error(`Error processing booking ID ${booking._id}:`, error);
//                 }
//             }
//         } else {
//             // console.log('No unassigned bookings found that are older than 2 minutes');
//         }
//     } catch (error) {
//         // console.error('Error checking bookings:', error);
//     }
// };


// const assignVendorCron = cron.schedule('* * * * * *', () => { // Runs every second
//     try {
//         checkAllBookingsVendors();
//     } catch (error) {
//         console.log(error);
//         console.log("Something went wrong while running the assign vendor cron");
//     }
// });

// module.exports = assignVendorCron;



const cron = require('node-cron');
const moment = require('moment');
const { assignVendor } = require('../../utils/mail');
const Booking = require("../booking/booking-model");
const Service = require("../services/services-model")

const checkAllBookingsVendors = async () => {
    try {
        // Find bookings where at least one vendor object has a null vendor_id and email_sent is false
        const bookings = await Booking.find({
            vendors: {
                $elemMatch: {
                    vendor_id: { $exists: true, $eq: null }, // or { $eq: "" } if empty string
                    email_sent: false
                }
            }
        });

        // Filter bookings older than 3 hours
        const unassignedBookings = bookings.filter(booking => {
            const threeHoursAgo = moment().subtract(3, 'hours');
            return moment(booking.created_at).isBefore(threeHoursAgo);
        });

        if (unassignedBookings.length > 0) {
            console.log('Found unassigned bookings:', unassignedBookings.length);

            for (let booking of unassignedBookings) {
                for (let vendor of booking.vendors) {
                    // Check if vendor_id is null and email_sent is false
                    if (vendor.vendor_id === null && !vendor.email_sent) {
                        try {
                            // Prepare email content for this specific service
                            const mailData = {
                                pod: booking.pod,
                                remaining_amount: booking.remaining_amount,
                                paid_amount: booking.paid_amount,

                                service_date : booking.service_date,
                                service_time : booking.service_time,
                                booking_date: booking.booking_date,
                                booking_id: booking.booking_id,

                                service_name: await getServiceName(vendor.service_id) // Fetch service name
                            };

                            // Send email for this specific service
                            await assignVendor(mailData);

                            // Update email_sent status to true for this specific vendor object
                            vendor.email_sent = true;
                        } catch (error) {
                            // console.error(`Error processing service ID ${vendor.service_id} in booking ID ${booking._id}:`, error);
                        }
                    }
                }

                // Save the booking if any vendor email status has changed
                await booking.save();
            }
        } else {
            // console.log('No unassigned bookings found that are older than 3 hours');
        }
    } catch (error) {
        // console.error('Error checking bookings:', error);
    }
};

// Helper function to get the service name
const getServiceName = async (serviceId) => {
    const service = await Service.findById(serviceId);
    return service ? service.service_name : 'Unknown Service';
};

// Schedule the cron job to run every minute
const assignVendorCron = cron.schedule('* * * * *', () => { // Runs every minute
    try {
        checkAllBookingsVendors();
    } catch (error) {
        console.log(error);
        console.log("Something went wrong while running the assign vendor cron");
    }
});

module.exports = assignVendorCron;
