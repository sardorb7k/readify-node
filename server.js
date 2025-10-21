require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const expressLayouts = require("express-ejs-layouts");
const { sequelize } = require("./models");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const bookRoutes = require("./routes/book");
const clubRoutes = require("./routes/club");
const membershipRoutes = require("./routes/membership");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sessionStore = new SequelizeStore({ db: sequelize });

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

(async () => {
  await sequelize.authenticate();
  await sessionStore.sync();
  await sequelize.sync({ alter: true });
})();

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

// routes
app.get("/", (req, res) => {
  res.render("index", {
    user: req.session.user,
    title: "Readify",
  });
});
app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/books", bookRoutes);
app.use("/clubs", clubRoutes);
app.use("/membership", membershipRoutes);
app.use((req, res) => {
  res.status(404).render("404", { title: "404 Not Found" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
