const express = require('express');
const router = express.Router();

const { createServiceBanner, getAllServicesBanners, deleteServicesBannersByID } = require("./services-banners-controller");

router.post("/create-service-banner", createServiceBanner);

router.get("/get-all-services-banners", getAllServicesBanners);

router.post("/delete-service-banner/:id", deleteServicesBannersByID);

module.exports = router;