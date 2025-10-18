const { DataTypes } = require("sequelize");
const { sequelize } = require("./database");

const { Pet } = require("./model_pet");

const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    search_name: {
      type: DataTypes.STRING(510), // 255 + 255
      allowNull: false,
      validate: {
        isUppercase: true,
        notNull: {
          msg: "Search name is required",
        },
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "First name must be between 1 and 255 characters",
        },
        notNull: {
          msg: "First name is required",
        },
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Last name must be between 1 and 255 characters",
        },
        notNull: {
          msg: "Last name is required",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: "Invalid email",
        },
        notNull: {
          msg: "Email is required",
        },
      },
    },
    // username: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   unique: true,
    //   validate: {
    //     notNull: {
    //       msg: "Username is required",
    //     },
    //   },
    // },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
          msg: "Password must be at least 6 characters long and contain at least one letter, one number, and one special character",
        },
        notNull: {
          msg: "Password is required",
        },
      },
    },
  },
  {
    tableName: "users",
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

User.belongsToMany(Pet, {
  through: "pet_user",
  foreignKey: "id_user",
});

Pet.belongsToMany(User, {
  through: "pet_user",
  foreignKey: "id_pet",
});

(async () => {
  await User.sync({ force: true }); // Drop table and re-create
  // await User.sync({ alter: true });
})();

module.exports = { User };
