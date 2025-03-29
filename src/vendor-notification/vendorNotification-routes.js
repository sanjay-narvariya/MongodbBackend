const express = require('express');
const { getAllVendorBookingNotification } = require('./vendorNotification-controller');

const router = express.Router();

router.get('/get-all-vendor-booking-notifications',getAllVendorBookingNotification)
module.exports = router;