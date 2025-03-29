const express = require('express');
const router = express.Router();

const { createSlot, updateSlotByID, deleteSlotByID, getAllSlot } = require("./slot-controller");

router.post("/create-slot", createSlot);

router.post("/update-slot/:id", updateSlotByID);

router.post("/delete-slot/:id", deleteSlotByID);

router.get("/get-all-slot", getAllSlot);

module.exports = router;