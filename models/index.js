const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserModel = require("./user");
const ProfileModel = require("./profile");
const ClubModel = require("./club");
const BookModel = require("./book");
const MembershipModel = require("./membership");
const RatingModel = require("./rating");
const CommentModel = require("./comment");

// Initialize models
const User = UserModel(sequelize, DataTypes);
const Profile = ProfileModel(sequelize, DataTypes);
const Club = ClubModel(sequelize, DataTypes);
const Book = BookModel(sequelize, DataTypes);
const Membership = MembershipModel(sequelize, DataTypes);
const Rating = RatingModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);

// Associations

// User ↔ Profile (1:1)
User.hasOne(Profile, {
  foreignKey: "userId",
  as: "profile",
  onDelete: "CASCADE",
});
Profile.belongsTo(User, { foreignKey: "userId", as: "user" });

// Club ↔ Book (1:N)
Club.hasMany(Book, { foreignKey: "clubId", as: "books", onDelete: "CASCADE" });
Book.belongsTo(Club, { foreignKey: "clubId", as: "club" });

// User ↔ Club (1:N admin)
User.hasMany(Club, {
  foreignKey: "adminId",
  as: "adminClubs",
  onDelete: "CASCADE",
});
Club.belongsTo(User, { foreignKey: "adminId", as: "admin" });

// User ↔ Book (Many-to-Many via Membership)
User.belongsToMany(Book, {
  through: Membership,
  as: "joinedBooks",
  foreignKey: "userId",
});
Book.belongsToMany(User, {
  through: Membership,
  as: "members",
  foreignKey: "bookId",
});

// Ratings
User.hasMany(Rating, {
  foreignKey: "user_id", // use database column
  as: "ratings",
  onDelete: "CASCADE",
});
Rating.belongsTo(User, { foreignKey: "user_id", as: "user" });

Book.hasMany(Rating, {
  foreignKey: "book_id",
  as: "ratings",
  onDelete: "CASCADE",
});
Rating.belongsTo(Book, { foreignKey: "book_id", as: "book" });

// Comments
User.hasMany(Comment, {
  foreignKey: "userId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

Book.hasMany(Comment, {
  foreignKey: "bookId",
  as: "comments",
  onDelete: "CASCADE",
});
Comment.belongsTo(Book, { foreignKey: "bookId", as: "book" });

// User ↔ Book (1:N created by user)
User.hasMany(Book, {
  foreignKey: "userId", // use the column in Book for creator
  as: "createdBooks", // must match include alias
  onDelete: "CASCADE",
});
Book.belongsTo(User, { foreignKey: "userId", as: "creator" });

module.exports = {
  sequelize,
  User,
  Profile,
  Club,
  Book,
  Membership,
  Rating,
  Comment,
};
