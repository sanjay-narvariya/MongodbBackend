const { Router } = require("express");
const { createCustomer, getAllCustomer, getCustomerByID, deleteCustomerByID, updateCustomerByID,
    createProfilePicture, deleteProfilePictureByID, updateProfilePictureByID, sendVerificationEmail,
    verifyOtpForEmail, sendOtpForPhone, verifyOtpForPhone, getUser, sendOtpForChangeEmail, verifyOtpForChangeEmail,
    searchCustomers, getCustomerAndVendorCounts,
    getExportedCustomerData,
    getNewCustomers } = require("./customer-controller");
const authenticate = require("../../middleware/auth");

const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/profile-picture");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
    },
});

const upload = multer({ storage: storage });

const router = Router();

router.post("/create-customer", createCustomer);

router.get("/get-all-customer", getAllCustomer);

router.get("/get-customer/:id", getCustomerByID);

router.post("/delete-customer/:id", deleteCustomerByID);

router.post("/update-customer/:id", updateCustomerByID);

router.post("/create-profile-picture/:id", upload.single("profile_picture"), createProfilePicture);

router.post("/delete-profile-picture/:id", deleteProfilePictureByID);

router.post("/update-profile-picture/:id", upload.single("profile_picture"), updateProfilePictureByID);

router.post("/send-verification-email", sendVerificationEmail);

router.post("/verify-otp-for-email", verifyOtpForEmail);

router.post("/send-otp-for-phone", sendOtpForPhone);

router.post("/verify-otp-for-phone", verifyOtpForPhone);

router.get("/get-user", authenticate, getUser);

router.post("/send-otp-for-change-email", sendOtpForChangeEmail);

router.post("/verify-otp-for-change-email", verifyOtpForChangeEmail);

router.post("/search-customers/:term", searchCustomers);

router.post("/get-export-data", getExportedCustomerData);

router.get("/get-customer-and-vendor-count", getCustomerAndVendorCounts);

router.get("/get-new-customers", getNewCustomers);

module.exports = router;