const fs = require("fs");
const path = require("path");
const { Club, User, Book } = require("../models");

exports.index = async (req, res) => {
  try {
    const clubs = await Club.findAll({ include: "admin" });
    res.render("clubs/index", {
      title: "Clubs",
      clubs,
      currentUser: req.session.user,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.createForm = async (req, res) => {
  const admins = await User.findAll();
  res.render("clubs/create", {
    title: "Add Club",
    admins,
    currentUser: req.session.user,
  });
};

exports.create = async (req, res) => {
  try {
    const { name, description, adminId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Club.create({ name, description, adminId, image });
    res.redirect("/clubs");
  } catch (err) {
    res.render("clubs/create", {
      title: "Add Club",
      errors: [err.message],
      currentUser: req.session.user,
    });
  }
};

exports.editForm = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    const admins = await User.findAll();

    if (!club) return res.redirect("/clubs");

    res.render("clubs/edit", {
      title: "Edit Club",
      club,
      admins,
      currentUser: req.session.user,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.update = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.redirect("/clubs");

    const { name, description, adminId } = req.body;
    let image = club.image;

    // If new image uploaded — delete old one
    if (req.file) {
      if (club.image) {
        const oldPath = path.join(__dirname, "..", "public", club.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image = `/uploads/${req.file.filename}`;
    }

    await club.update({ name, description, adminId, image });
    res.redirect("/clubs");
  } catch (err) {
    res.render("clubs/edit", {
      title: "Edit Club",
      errors: [err.message],
      currentUser: req.session.user,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id);
    if (club && club.image) {
      const imagePath = path.join(__dirname, "..", "public", club.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Club.destroy({ where: { id: req.params.id } });
    res.redirect("/clubs");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.details = async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id, {
      include: [
        { model: User, as: "admin" },
        { model: Book, as: "books" }, // books in this club
      ],
    });

    if (!club) return res.render("404", { title: "Club Not Found" });

    res.render("clubs/details", {
      title: club.name,
      club,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching club details");
  }
};
