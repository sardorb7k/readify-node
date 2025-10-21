exports.ensureAuth = (req, res, next) => {
  if (req.session && req.session.user) return next();
  return res.redirect("/login");
};

exports.ensureGuest = (req, res, next) => {
  if (!req.session || !req.session.user) return next();
  return res.redirect("/");
};

/**
 * ensureRole('organizer') or ensureRole('admin')
 */
exports.ensureRole = (role) => (req, res, next) => {
  if (!req.session || !req.session.user) return res.redirect("/login");
  const userRole = req.session.user.role;
  if (userRole === role || userRole === "admin") return next();
  return res.status(403).send("Forbidden");
};
