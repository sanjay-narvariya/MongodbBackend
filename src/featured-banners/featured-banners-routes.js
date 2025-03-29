const { Router } = require("express");
const { createFeaturedBanner, getAllFeaturedBanner, deleteFeaturedBannerByID } = require("./featured-banners-controller");

const router = Router();

router.post("/create-featured-banner", createFeaturedBanner);

router.get("/get-all-featured-banner", getAllFeaturedBanner);

router.post("/delete-featured-banner/:id", deleteFeaturedBannerByID);


module.exports = router;
