const express = require('express');
const router = express.Router();

const { createVendorPayment, getAllVendorPayments, getVendorPaymentById, updateVendorPayment, deleteVendorPayment } = require('./vendor-payment-controller');

router.post("/create-vendor-payment", createVendorPayment);

router.get("/get-all-vendor-payments", getAllVendorPayments);

router.post("/get-vendor-payment-by-id", getVendorPaymentById);

router.post("/update-vendor-payment", updateVendorPayment);

router.post("/delete-vendor-payment", deleteVendorPayment);



module.exports = router;