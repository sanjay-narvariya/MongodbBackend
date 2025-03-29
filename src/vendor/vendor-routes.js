const express = require('express');
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/vendor-picture");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
    },
});

const upload = multer({ storage: storage });

const { createVendor, getVendorByID, updateVendorByID, assignVendorByAdmin, deleteVendorByID,
    getVendorByService, getAllVendors, createProfilePicture, deleteProfilePictureByID, updateProfilePictureByID,
    sendOtpForPhone, verifyOtpForPhone, searchVendor, searchVendors, assignVendor, getLastMonthEarnings,
    getExportedVendorData} = require("./vendor-controller");


router.post("/create-vendor", createVendor);

router.get("/get-vendor/:id", getVendorByID);

router.post("/update-vendor/:id", updateVendorByID);

router.post("/delete-vendor/:id", deleteVendorByID);

router.get("/get-all-vendors", getAllVendors);

router.post("/create-profile-picture/:id", upload.single("profile_picture"), createProfilePicture);

router.post("/delete-profile-picture/:id", deleteProfilePictureByID);

router.post("/update-profile-picture/:id", upload.single("profile_picture"), updateProfilePictureByID);

router.post("/send-otp-for-phone", sendOtpForPhone);

router.post("/verify-otp-for-phone", verifyOtpForPhone);

router.post("/search-vendor", searchVendor);

router.post("/search-vendors/:term", searchVendors);

router.post("/assigning-vendor/:booking_id", assignVendor);

router.post("/assign-vendor-by-admin/:booking_id", assignVendorByAdmin);

router.post("/get-vendor-by-service", getVendorByService);

router.post("/get-export-data", getExportedVendorData);

router.get("/last-month-vendor-earning/:id", getLastMonthEarnings);


module.exports = router;