const express = require('express');
const { createNewsletter, getAllNewsletters, getExportedNewslettersData } = require('./newsletter-controller');
const router = express.Router();

router.post("/create-newsletter", createNewsletter);

router.get("/get-all-newsletters", getAllNewsletters);

router.post("/get-export-data", getExportedNewslettersData);

module.exports = router;