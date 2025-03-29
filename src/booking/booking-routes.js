const express = require('express');
const router = express.Router();
const { createBooking, getBookingByID, updateBookingByID, getAllBookings, onSiteBooking, getBookingByCustomerID,
    getAllBookingsByDate, getAllBookingsByCityAndDate, getTotalSales, getDashboardStats, getLatestBookings, getAllSales,
    getBookingsOfCurrentMonth, searchBookings, getBookingByVendorID } = require("./booking-controller");
const { getBookedServicesByCustomer } = require('./booking-controller');

router.post("/create-booking", createBooking);

router.get("/get-booking/:id", getBookingByID);

router.post("/update-booking/:id", updateBookingByID);

router.get("/get-all-booking", getAllBookings);

router.get("/get-booking-by-customer/:customerid", getBookingByCustomerID);

router.get("/get-booking-by-vendor/:vendorid", getBookingByVendorID);

router.get("/get-booked-services-by-customer/:customerid", getBookedServicesByCustomer);

router.post("/get-all-bookings-by-city-date", getAllBookingsByCityAndDate);

router.get("/get-dashboard-stats", getDashboardStats);

router.get("/get-latest-bookings", getLatestBookings);

router.get("/get-bookings-of-current-month", getBookingsOfCurrentMonth);

router.get("/get-all-sales", getAllSales);

router.post("/search-bookings/:term", searchBookings);

router.post("/on-site-booking", onSiteBooking);

module.exports = router;