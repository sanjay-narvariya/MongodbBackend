const { Router } = require("express");
const { createFaq, getAllFaq, deleteFaqByID, updateFaqByID } = require("../vendor-faq/vendor-faq-controller");

const router = Router();

router.post("/create-faq", createFaq);

router.get("/get-all-faq", getAllFaq);

router.post("/delete-faq/:id", deleteFaqByID);

router.post("/update-faq/:id", updateFaqByID);

module.exports = router;