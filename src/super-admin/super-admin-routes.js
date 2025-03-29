const express = require('express');
const router = express.Router();

const { createSuperAdmin, updateSuperAdminByID, superAdminLogin, changePassword, sendOtpForChangeEmail, verifyOtpForChangeEmail,sendResetPasswordEmail, resetPassword } = require("./super-admin-controller");

router.post("/create-super-admin", createSuperAdmin);

router.post("/update-super-admin/:id", updateSuperAdminByID);

router.post("/super-admin-login", superAdminLogin);

router.post("/change-password-super-admin/:id", changePassword);

router.post("/send-otp-for-change-email", sendOtpForChangeEmail);

router.post("/verify-otp-for-change-email", verifyOtpForChangeEmail);

router.post("/send-reset-password-email", sendResetPasswordEmail);

router.post("/reset-password", resetPassword);

module.exports = router;