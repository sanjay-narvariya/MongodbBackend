
const firebaseConfig = require("../../utils/firebase");
const Vendor = require("../vendor/vendor-model");
const VendorNotification = require("../vendor-notification/vendorNotification-model");

exports.sendNotificationsToVendors = async (vendorIds, bookingData) => {
    try {
        const notificationPromises = vendorIds?.map(async (vendor) => {
            if (vendor?.vendor_id && vendor?.vendor_id !== "") {
                const vendorDetails = await Vendor.findOne({ _id: vendor?.vendor_id });
                const vendorDeviceToken = vendorDetails?.device_token;

                if (vendorDeviceToken && vendorDeviceToken !== "") {
                    await VendorNotification.create({
                        title: "Vendor_booking",
                        message: 'New booking created',
                        booking_id: bookingData?._id,
                        customer_id: bookingData?.customer_id,
                        vendor_id: vendor?.vendor_id,
                        created_at: Date.now()
                    });

                    const notificationMessage = {
                        data: {
                            notificationTitle: 'Vendor_booking',
                            vendor_id: vendor?.vendor_id,
                            booking_id: bookingData?._id,
                            customer_id: bookingData?.customer_id,
                        },
                        notification: {
                            title: `Booking Created`,
                            body: `A new booking has been created`
                        },
                        token: vendorDeviceToken
                    };

                    try {
                        const response = await firebaseConfig.messaging().send(notificationMessage);
                        console.log('Successfully sent notification to vendor:', response);
                    } catch (error) {
                        console.log('Error sending notification to vendor:', error);
                    }
                }
            }
        });

        await Promise.all(notificationPromises);
    } catch (error) {
        console.log('error', error);
        return next(new ErrorHandler(error.message, 500));
    }
};
