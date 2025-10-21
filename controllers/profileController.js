const { Profile, Book, User, Club } = require("../models");
const path = require("path");
const fs = require("fs");

exports.showProfile = async (req, res) => {
  const user = await User.findByPk(req.session.user.id, {
    include: [
      { model: Profile, as: "profile" },
      { model: Book, as: "createdBooks" }, // match alias
      { model: Club, as: "adminClubs" }, // match alias
      { model: Book, as: "joinedBooks" }, // match alias
    ],
  });

  res.render("profile", {
    title: "Profile",
    user,
    profile: user.profile,
    createdBooks: user.createdBooks,
    joinedBooks: user.joinedBooks,
    adminClubs: user.adminClubs,
  });
};

exports.updateProfile = async (req, res) => {
  const { firstName, lastName, bio } = req.body;
  let updateData = { firstName, lastName, bio };

  if (req.file) {
    updateData.image = "/uploads/" + req.file.filename;
  }

  const oldProfile = await Profile.findOne({
    where: { userId: req.session.user.id },
  });

  // delete old image if exists
  if (req.file && oldProfile.image) {
    const oldPath = path.join(__dirname, "../public", oldProfile.image);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  await Profile.update(updateData, {
    where: { userId: req.session.user.id },
  });

  req.session.user.firstName = firstName;
  if (req.file) {
    req.session.user.profileImage = updateData.image;
  }
  res.redirect("/profile");
};
