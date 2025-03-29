const { Router } = require("express");
const { createCoupon, getAllCoupon, deleteCouponByID, updateCouponByID, getCoupon, searchCoupons } = require("./coupon-controller");
const authenticate = require("../../middleware/auth");

const router = Router();

router.post("/create-coupon", createCoupon);

router.get("/get-all-coupon", getAllCoupon);

router.post("/get-coupon", getCoupon);

router.post("/delete-coupon/:id", deleteCouponByID);

router.post("/update-coupon/:id", updateCouponByID);

router.post("/search-coupons/:term", searchCoupons);


module.exports = router;
