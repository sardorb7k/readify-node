const { Membership } = require("../models");

exports.join = async (req, res) => {
  backURL = req.header("Referer") || "/";
  try {
    const userId = req.session.user.id;
    const bookId = req.params.id;

    const exists = await Membership.findOne({ where: { userId, bookId } });
    if (exists) return res.redirect(backURL);

    await Membership.create({ userId, bookId });
    res.redirect(backURL);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.leave = async (req, res) => {
  backURL = req.header("Referer") || "/";
  try {
    const userId = req.session.user.id;
    const bookId = req.params.id;

    await Membership.destroy({ where: { userId, bookId } });
    res.redirect(backURL);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
