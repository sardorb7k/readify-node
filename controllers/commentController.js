const { Comment } = require("../models");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.params;

    await Comment.create({
      user_id: req.session.user.id,
      book_id: id,
      text,
    });

    res.redirect(`/books/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding comment");
  }
};
