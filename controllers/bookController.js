const {
  Book,
  Club,
  User,
  Comment,
  Membership,
  Rating,
  Profile,
} = require("../models");
const fs = require("fs");
const path = require("path");

exports.index = async (req, res) => {
  const books = await Book.findAll({ include: "club" });
  res.render("books/index", {
    title: "Books",
    books,
    currentUser: req.session.user,
  });
};

exports.createForm = async (req, res) => {
  const clubs = await Club.findAll();
  res.render("books/create", {
    title: "Add Book",
    clubs,
    currentUser: req.session.user,
  });
};

exports.create = async (req, res) => {
  try {
    const { title, author, description, clubId } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    await Book.create({
      title,
      author,
      description,
      clubId,
      image,
      userId: req.session.user.id,
    });
    res.redirect("/books");
  } catch (err) {
    res.render("books/create", { title: "Add Book", errors: [err.message] });
  }
};

exports.update = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    let image = book.image;

    // if new image uploaded, delete old one
    if (req.file) {
      if (book.image) {
        const oldPath = path.join(__dirname, "..", "public", book.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      image = `/uploads/${req.file.filename}`;
    }

    await Book.update(
      {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        clubId: req.body.clubId,
        image,
      },
      { where: { id: req.params.id } }
    );

    res.redirect("/books");
  } catch (err) {
    res.render("books/edit", { title: "Edit Book", errors: [err.message] });
  }
};
exports.editForm = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  const clubs = await Club.findAll();
  res.render("books/edit", {
    title: "Edit Book",
    book,
    clubs,
    currentUser: req.session.user,
  });
};

exports.delete = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book && book.image) {
    const imagePath = path.join(__dirname, "..", "public", book.image);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
  }
  await Book.destroy({ where: { id: req.params.id } });
  res.redirect("/books");
};

exports.details = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          as: "comments",
          include: {
            model: User,
            as: "user",
            include: { model: Profile, as: "profile" },
          },
        },
        { model: Club, as: "club" },
        { model: Rating, as: "ratings" }, // <-- include ratings
      ],
    });

    if (!book) return res.render("404", { title: "Book Not Found" });

    const userId = req.session.user?.id;

    // Check if user has joined
    const isJoined = userId
      ? await Membership.findOne({ where: { bookId: book.id, userId } })
      : false;

    // Calculate average rating
    const avgRating =
      book.ratings.length > 0
        ? (
            book.ratings.reduce((sum, r) => sum + r.rating, 0) /
            book.ratings.length
          ).toFixed(1)
        : null;

    const userRating = userId
      ? book.ratings.find((r) => r.user_id === userId)?.rating || null
      : null;
    const comments = book.comments || [];
    res.render("books/details", {
      title: book.title,
      book,
      currentUser: req.session.user || null,
      isJoined: !!isJoined,
      avgRating: avgRating,
      userRating,
      comments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching book details");
  }
};
