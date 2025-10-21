const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");
const { ensureAuth } = require("../middlewares/auth");

router.post("/join/:id", ensureAuth, membershipController.join);
router.post("/leave/:id", ensureAuth, membershipController.leave);

module.exports = router;
