const express = require('express');
const router = express.Router();

const { createMembershipPurchased, getAllMembershipPurchased, getAllMembershipPurchasedByCityAndDate, checkMembershipPurchasedByCustomer } = require("./membership-purchased-controller");

router.post("/create-membership-purchase", createMembershipPurchased);

router.get("/get-all-membership-customers", getAllMembershipPurchased);

router.post("/get-all-membership-purchased-by-city-date", getAllMembershipPurchasedByCityAndDate);

router.get("/membership-purchased-by-customer/:id", checkMembershipPurchasedByCustomer);


module.exports = router;