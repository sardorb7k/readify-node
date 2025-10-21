const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { ensureAuth } = require("../middlewares/auth");

router.get("/register", authController.showRegister);
router.post("/register", authController.register);

router.get("/login", authController.showLogin);
router.post("/login", authController.login);

router.post("/logout", ensureAuth, authController.logout);

module.exports = router;
