const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { ensureAuth } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.get("/", ensureAuth, profileController.showProfile);
router.post(
  "/",
  ensureAuth,
  upload.single("image"),
  profileController.updateProfile
);

module.exports = router;
