const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const upload = require("../middlewares/upload");
const { ensureAuth } = require("../middlewares/auth");
const ratingController = require("../controllers/ratingController");
const commentController = require("../controllers/commentController");

router.get("/", ensureAuth, bookController.index);
router.get("/create", ensureAuth, bookController.createForm);
router.post(
  "/create",
  ensureAuth,
  upload.single("image"),
  bookController.create
);
router.get("/edit/:id", ensureAuth, bookController.editForm);
router.post(
  "/edit/:id",
  ensureAuth,
  upload.single("image"),
  bookController.update
);
router.post("/delete/:id", ensureAuth, bookController.delete);
router.post("/:id/rate", ensureAuth, ratingController.addRating);
router.post("/:id/comments", ensureAuth, commentController.addComment);
router.get("/:id", ensureAuth, bookController.details);

module.exports = router;
