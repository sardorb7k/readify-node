const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    "Rating",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 },
      },
    },
    {
      tableName: "ratings",
      indexes: [
        {
          unique: true,
          fields: ["user_id", "book_id"], // ensures one rating per user per book
        },
      ],
    }
  );

  return Rating;
};
