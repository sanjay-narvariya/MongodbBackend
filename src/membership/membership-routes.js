const express = require('express');
const router = express.Router();

const { createMembership, getMembershipByID, updateMembershipByID, getAllMembership,checkMembershipPurchasedByCustomer } = require("./membership-controller");

router.post("/create-membership", createMembership);

router.get("/get-membership/:id", getMembershipByID);

router.post("/update-membership/:id", updateMembershipByID);

router.get("/get-all-membership", getAllMembership);



module.exports = router;