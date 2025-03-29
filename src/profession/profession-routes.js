const express = require('express');
const router = express.Router();

const { createProfession, getProfessionByID, getAllProfession, updateProfession, deleteProfession, searchProfessions } = require("./profession-controller");

router.post("/create-profession", createProfession);

router.get("/get-profession/:id", getProfessionByID);

router.get("/get-all-profession", getAllProfession);

router.post("/update-profession/:id", updateProfession);

router.post("/delete-profession/:id", deleteProfession);

router.post("/search-professions/:term", searchProfessions);

module.exports = router;