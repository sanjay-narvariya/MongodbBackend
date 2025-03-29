const express = require('express');
const router = express.Router();

const { createReview, updateReviewByID, deleteReviewByID, getAllReviewByCustomerID, getAllReviewBySubServiceID, getAllReviewByVendorID, getAllReviews, getAllReviewByServiceID, getReviewByBookingID } = require("./reviews-controller");

router.post("/create-review", createReview);

router.get("/get-all-reviews", getAllReviews);

router.post("/update-reviews/:id", updateReviewByID);

router.post("/delete-reviews/:id", deleteReviewByID);

router.get("/get-all-reviews-by-customer/:customerid", getAllReviewByCustomerID);

router.get("/get-review-by-booking/:bookingid", getReviewByBookingID);

router.get("/get-all-reviews-by-service/:serviceid", getAllReviewByServiceID);

router.get("/get-all-reviews-by-vendor/:vendorid", getAllReviewByVendorID);

module.exports = router;