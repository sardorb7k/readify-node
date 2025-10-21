const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const upload = require("../middlewares/upload");
const { ensureAuth } = require("../middlewares/auth");

router.get("/", ensureAuth, clubController.index);
router.get("/create", ensureAuth, clubController.createForm);
router.post(
  "/create",
  ensureAuth,
  upload.single("image"),
  clubController.create
);
router.get("/edit/:id", ensureAuth, clubController.editForm);
router.post(
  "/edit/:id",
  ensureAuth,
  upload.single("image"),
  clubController.update
);
router.post("/delete/:id", ensureAuth, clubController.delete);
router.get("/:id", ensureAuth, clubController.details);

module.exports = router;
