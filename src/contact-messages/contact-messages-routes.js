const express = require('express');
const router = express.Router();

const { createContactMessages } = require("./contact-messages-controller")

router.post("/create-contact-messages", createContactMessages);


module.exports = router;