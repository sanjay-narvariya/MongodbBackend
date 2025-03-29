const express = require('express');
const router = express.Router();

const { createServiceRequest, getServiceRequestByID, updateServiceRequestByID, getAllServiceRequest } = require("./service-request-controller");

router.post("/create-service-request", createServiceRequest);

router.get("/get-service-request/:id", getServiceRequestByID);

router.post("/update-service-request/:id", updateServiceRequestByID);

router.get("/get-all-service-request", getAllServiceRequest);


module.exports = router;