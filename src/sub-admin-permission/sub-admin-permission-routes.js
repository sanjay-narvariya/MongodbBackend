const express = require('express');
const router = express.Router();

const { createSubAdminPermission, getSubAdminPermissionByID, updateSubAdminPermissionByID, deleteSubAdminPermissionByID, getAllSubAdminPermission, searchPermissions } = require("./sub-admin-permission-controller");

router.post("/create-sub-admin-permission", createSubAdminPermission);

router.get("/get-sub-admin-permission/:id", getSubAdminPermissionByID);

router.post("/update-sub-admin-permission/:id", updateSubAdminPermissionByID);

router.post("/delete-sub-admin-permission/:id", deleteSubAdminPermissionByID);

router.get("/get-all-sub-admin-permission", getAllSubAdminPermission);

router.post("/search-permissions/:term", searchPermissions);


module.exports = router;