const express = require("express");
const router = express.Router();
const closetController = require("../controllers/closetController");

// Routes
router.get("/", closetController.getAllItems);
router.post("/", closetController.addItem);

module.exports = router;
