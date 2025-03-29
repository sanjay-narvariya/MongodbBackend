const express = require('express');
const router = express.Router();

const { createRefund, getRefundByID, getAllRefund, createUnserviceableRefund, updateRefund, getRefundByCustomerID, deleteRefund, getRefundByBookingID } = require("./refund-controller");

router.post("/create-refund", createRefund);

router.post("/create-unserviceable-refund", createUnserviceableRefund);

router.get("/get-refund/:id", getRefundByID);

router.get("/get-all-refunds", getAllRefund);

router.post("/update-refund/:id", updateRefund);

router.get("/get-refund-by-customer/:customerid", getRefundByCustomerID);

router.get("/get-refund-by-booking/:bookingid", getRefundByBookingID);

router.post("/delete-refund/:id", deleteRefund);

module.exports = router;