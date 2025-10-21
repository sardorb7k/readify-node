const bcrypt = require("bcrypt");
const { User, Profile } = require("../models");

const SALT_ROUNDS = 10;

exports.showRegister = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    errors: null,
    form: {},
    currentUser: req.session.user,
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, address, phone } =
      req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.render("auth/register", {
        title: "Register",
        errors: ["All required fields must be filled"],
        form: req.body,
        currentUser: req.session.user,
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.render("auth/register", {
        title: "Register",
        errors: ["Email already used"],
        form: req.body,
        currentUser: req.session.user,
      });
    }

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, email, password: hashed });

    const profile = await Profile.create({
      userId: user.id,
      firstName,
      lastName,
      address,
      phone,
    });

    req.session.user = {
      id: user.id,
      username: user.username,
      firstName: profile.firstName,
      email: user.email,
      role: user.role,
      profileImage: profile.image,
    };

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("auth/register", {
      title: "Register",
      errors: ["Server error"],
      form: req.body,
      currentUser: req.session.user,
    });
  }
};

exports.showLogin = (req, res) => {
  res.render("auth/login", {
    title: "Login",
    errors: null,
    form: {},
    currentUser: req.session.user,
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("auth/login", {
        title: "Login",
        errors: ["Provide email and password"],
        form: req.body,
        currentUser: req.session.user,
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("auth/login", {
        title: "Login",
        errors: ["Invalid credentials"],
        form: req.body,
        currentUser: req.session.user,
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render("auth/login", {
        title: "Login",
        errors: ["Invalid credentials"],
        form: req.body,
        currentUser: req.session.user,
      });
    }

    // 🔹 Get profile info
    const profile = await Profile.findOne({ where: { userId: user.id } });

    req.session.user = {
      id: user.id,
      username: user.username,
      firstName: profile?.firstName || "",
      email: user.email,
      role: user.role,
      profileImage: profile.image,
    };

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.render("auth/login", {
      title: "Login",
      errors: ["Server error"],
      form: req.body,
      currentUser: req.session.user,
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error(err);
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};
