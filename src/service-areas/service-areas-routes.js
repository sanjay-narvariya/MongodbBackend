const express = require('express');
const router = express.Router();

const { createServiceArea, getServiceAreaByID, updateServiceAreaByID, getAllServiceArea } = require("./service-areas-controller");

router.post("/create-service-area", createServiceArea);

router.get("/get-service-area/:id", getServiceAreaByID);

router.post("/update-service-area/:id", updateServiceAreaByID);

router.get("/get-all-service-area", getAllServiceArea);

module.exports = router;