const express = require('express');
const router = express.Router();

const { createSubAdmin, getSubAdminByID, updateSubAdminByID, deleteSubAdminByID, getAllSubAdmin, subAdminLogin, searchSubAdmins } = require("./sub-admin-controller");

router.post("/create-sub-admin", createSubAdmin);

router.get("/get-sub-admin/:id", getSubAdminByID);

router.post("/update-sub-admin/:id", updateSubAdminByID);

router.post("/delete-sub-admin/:id", deleteSubAdminByID);

router.get("/get-all-sub-admin", getAllSubAdmin);

router.post("/sub-admin-login", subAdminLogin);

router.post("/search-sub-admins/:term", searchSubAdmins);

module.exports = router;