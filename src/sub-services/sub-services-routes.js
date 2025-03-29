const express = require('express');
const router = express.Router();
const { createSubService, getAllSubServices, getSubServiceByID, getSubServicesForOnSite, deleteSubServiceByID, getSubServicesSuggestion, updateSubServiceByID, updateSubServiceWithPictureByID, searchSubServices } = require("./sub-services-controller")

const multer = require("multer");
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/service-picture");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
    },
});


const upload = multer({ storage: storage });

router.post("/create-sub-service", upload.single("sub_service_image"), createSubService);

router.get("/get-all-sub-services", getAllSubServices);

router.get("/get-sub-service/:id", getSubServiceByID);

router.get("/get-sub-services-for-onsite/:id", getSubServicesForOnSite);

router.post("/update-sub-service/:id", updateSubServiceByID);

router.post("/update-sub-service-with-picture/:id", upload.single("sub_service_image"), updateSubServiceWithPictureByID);

router.post("/delete-sub-service/:id", deleteSubServiceByID);

router.post("/search-sub-services/:term", searchSubServices);

router.get("/get-sub-services-suggestion", getSubServicesSuggestion);

module.exports = router;