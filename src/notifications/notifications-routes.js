const express = require('express');
const { createNotification, getAllNotifications, getAllVendorBookingNotification } = require('./notifications-controller');
const router = express.Router();


router.post("/create-notification", createNotification);

router.get("/get-all-notifications", getAllNotifications);


module.exports = router;