const { DataTypes } = require("sequelize");
const { sequelize } = require("./database");

const Pet = sequelize.define(
  "Pet",
  {
    id_pet: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    birthdate: {
      type: DataTypes.DATE,
    },
    collar_serial_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Collar serial number must be between 1 and 255 characters",
        },
        notNull: {
          msg: "Collar serial number is required",
        },
      },
    },
    collar_version: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Collar version must be between 1 and 255 characters",
        },
        notNull: {
          msg: "Collar version is required",
        },
      },
    },
    gps_data: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 255],
          msg: "Name must be between 1 and 255 characters",
        },
        notNull: {
          msg: "Name is required",
        },
      },
    },
  },
  {
    tableName: "pets",
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

(async () => {
  await Pet.sync({ force: true }); // Drop table and re-create
  // await Pet.sync({ alter: true });
})();

module.exports = {
  Pet,
};
