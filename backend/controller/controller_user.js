const { User } = require("../model/model_user");
const { Op } = require("sequelize");

const { deleteUndefinedProperties } = require("../utils/object_utils");

// Get all users
module.exports.getAllUsers = async (req, res) => {
  // TODO: [issue #5] do with pagination

  try {
    const users = await User.findAll({
      attributes: ["search_name", "first_name", "last_name", "email"],
      where: {
        deleted_at: null,
      },
      order: [["search_name", "DESC"]],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports.getById = async (req, res) => {
  const id_user = req.params.id;
  // console.log("id_user:", id_user);

  const user = await User.findByPk(id_user);
  // console.log("user:", user.dataValues);

  if (user === null) {
    res.status(404).send("User not found");
    return;
  }

  res.status(200).send(user);
};

module.exports.create = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  const properties = {
    first_name,
    last_name,
    // email: "pedro1@email.com",
    email,
    password,
    // password: "Aa!12",
    role,
  };

  let userToSave = {};

  // Validation
  try {
    userToSave = User.build(properties);
    await userToSave.validate();
    console.log("userToSave:", userToSave.dataValues);
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    res.status(400).send("[ERROR]\n" + error.message);
    return;
  }

  // Create
  try {
    await userToSave.save();
    res.status(201).send(userToSave);
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    error.message.includes("users_email_") ? res.status(400) : res.status(500);
    res.send("[ERROR]\n" + error.message);
  }
};

module.exports.update = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  const id_user = req.params.id;

  const userToUpdate = await User.findByPk(id_user);

  if (userToUpdate === null) {
    res.status(404).send("User not found");
    return;
  }

  const properties = { first_name, last_name, email, password, role };
  deleteUndefinedProperties(properties);

  // Validation
  try {
    userToUpdate.set(properties);
    await userToUpdate.validate();
    console.log("userToUpdate:", userToUpdate.dataValues);
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    res.status(400).send("[ERROR]\n" + error.message);
  }

  // Update
  try {
    await userToUpdate.save();
    res.status(204).send();
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    error.message.includes("users_email_") ? res.status(400) : res.status(500);
    res.send("[ERROR]\n" + error.message);
  }
};

module.exports.createOrUpdate = async (req, res) => {
  console.log("createOrUpdate()");
  const { first_name, last_name, email, password, confirm_password, role } =
    req.body;
  const id_user = req.params.id;

  let user;
  const properties = {
    first_name,
    last_name,
    email,
    password,
    role,
  };
  deleteUndefinedProperties(properties);

  //* Pre Validation
  // TODO: [Issue #1] Check if the user making the request is admin; if not, set properties.role = "user"

  //* Update
  if (id_user) {
    // console.log("Update User");

    const userWithSameEmail = await User.findOne({
      where: { email, id_user: { [Op.ne]: id_user } },
    });
    if (userWithSameEmail) {
      console.log("userWithSameEmail:", userWithSameEmail);
      return res.status(400).send("Um usuário já utiliza este e-mail");
    }

    user = await User.findByPk(id_user);
    if (!user) return res.status(404).send("User not found");

    user.set(properties);
  }

  //* Create/SignUp
  else {
    // console.log("Create User");

    const userWithSameEmail = await User.findOne({ where: { email } });
    if (userWithSameEmail) return res.status(400).send("Usuário já cadastrado");

    user = User.build(properties);
  }

  //* Validation
  try {
    // Verifica se as senhas são iguais quando a requisição vem do /signup
    console.log("originalUrl:", req.originalUrl);
    if (req.originalUrl.endsWith("/signup") && password !== confirm_password) {
      throw new Error("Senhas não conferem");
    }

    await user.validate();
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(400).send("[ERROR]\n" + error.message);
  }

  //* Save
  try {
    await user.save();

    const safeUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    id_user ? res.status(204) : res.status(201);
    res.send(safeUser);
    // res.send();
    return;
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(500).send("[ERROR]\n" + error.message);
  }
};

module.exports.delete = async (req, res) => {
  const id_user = req.params.id;

  // TODO: [issue #3] delete pets
  // TODO: [issue #1] check if the user making the request is admin or same user

  // Search user
  const userToDelete = await User.findByPk(id_user);
  if (!userToDelete) return res.status(404).send("User not found");

  // Delete
  try {
    await userToDelete.destroy();
    return res.status(204).send();
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(500).send("[ERROR]\n" + error.message);
  }
};

module.exports.restoreUser = async (req, res) => {
  const id_user = req.params.id;
  // console.log("id_user:", id_user);

  // TODO: [issue #4] restore pets

  //Search User
  const userToRestore = await User.findByPk(id_user, { paranoid: false });
  if (!userToRestore) return res.status(404).send("User not found");

  // Restore
  try {
    await userToRestore.restore();
    return res.status(204).send();
  } catch (error) {}
};
