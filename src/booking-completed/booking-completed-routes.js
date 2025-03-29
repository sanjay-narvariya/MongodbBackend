const express = require('express');
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/booking-picture");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
    },
});


const upload = multer({ storage: storage });

const { createBookingCompleted, getBookingCompletedByID,getBookingCompletedByBookingID } = require("./booking-completed-controller")

router.post("/create-booking-completed",upload.any(), createBookingCompleted);

router.get("/get-booking-completed/:id", getBookingCompletedByID);

router.get("/get-booking-completed-by-bookingID/:id", getBookingCompletedByBookingID);

module.exports = router;