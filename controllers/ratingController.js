const { Rating } = require("../models");

exports.addRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { id } = req.params;

    // Upsert ensures one rating per user per book
    await Rating.upsert({
      user_id: req.session.user.id,
      book_id: id,
      rating,
    });

    res.redirect(`/books/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving rating");
  }
};
