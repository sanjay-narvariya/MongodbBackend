const express = require('express');
const router = express.Router();

const { createFeedback, getAllFeedback, updateFeedback, getFeedbackByCustomerID, deleteFeedback } = require("./feedback-controller");

router.post("/create-feedback", createFeedback);

router.get("/get-all-feedback", getAllFeedback);

router.post("/update-feedback/:id", updateFeedback);

router.get("/get-feedback-by-customer/:customerid", getFeedbackByCustomerID);

router.post("/delete-feedback/:id", deleteFeedback);

module.exports = router;