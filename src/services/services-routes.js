const express = require('express');
const router = express.Router()
const { createService, getAllServices, getSearch, getRandomServices, getServiceByID, deleteServiceByID, updateServiceByID, updateServiceWithPictureByID, searchServices } = require("./services-controller");

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

router.post("/create-service", upload.single("service_image"), createService);

router.get("/get-all-services", getAllServices);

router.get("/get-service/:id", getServiceByID);

router.post("/delete-service/:id", deleteServiceByID);

router.post("/update-service/:id", updateServiceByID);

router.post("/update-service-with-picture/:id", upload.single("service_image"), updateServiceWithPictureByID);

router.post("/search-services/:term", searchServices);

router.get("/get-random-services", getRandomServices);

router.post("/search", getSearch);

module.exports = router;