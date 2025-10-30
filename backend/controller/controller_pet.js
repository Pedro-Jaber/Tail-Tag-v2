const { Pet } = require("../model/model_pet");
const { User } = require("../model/model_user");
const { Op } = require("sequelize");

const { deleteUndefinedProperties } = require("../utils/object_utils");

module.exports.getAllPets = async (req, res) => {
  // TODO: [issue #5] do with pagination

  const params = {
    attributes: ["name", "birthdate"],
    where: {
      deleted_at: null,
    },
    order: [["name", "DESC"]],
  };

  if (req.params.id) {
    const id_user = req.params.id;
    // console.log("id_user:", id_user);3

    // where.id_user = id_user;

    params.include = {
      model: User,
      attributes: [],
      where: {
        id_user,
      },
      required: true,
    };
  }

  try {
    const pets = await Pet.findAll(params);
    res.json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};

module.exports.getById = async (req, res) => {
  const id_pet = req.params.id;
  // console.log("id_pet:", id_pet);
  const owners = req.query.owners === "true";
  let options = {};
  if (owners) {
    options = {
      include: {
        model: User,
        as: "Owners",
        attributes: [
          ["first_name", "owner_first_name"],
          ["last_name", "owner_last_name"],
          "id_user",
        ],
      },
    };
  }

  const pet = await Pet.findByPk(id_pet, options);
  // console.log("pet:", pet.dataValues);

  if (pet === null) {
    res.status(404).send("Pet not found");
    return;
  }

  res.status(200).send(pet);
};

module.exports.getUsersPets = async (req, res) => {
  const id_user = req.params.id;
  // console.log("id_user:", id_user);

  // TODO: [issue #5] do with pagination

  try {
    const pets = await Pet.findAll({});
  } catch (error) {}
};

module.exports.assignPetToUser = async (req, res) => {
  const { id_user, id_pet } = req.body;

  if (!id_user || !id_pet) {
    res.status(400).send("id_user and id_pet are required");
    return;
  }

  const user = await User.findByPk(id_user);

  if (user === null) {
    res.status(404).send("User not found");
    return;
  }

  const pet = await Pet.findByPk(id_pet);

  if (pet === null) {
    res.status(404).send("Pet not found");
    return;
  }

  try {
    await user.addPet(pet);
    res.status(200).send("Pet assigned to user");
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    res.status(500).send("[ERROR]\n" + error.message);
  }
};

module.exports.createOrUpdate = async (req, res) => {
  console.log("createOrUpdate()");
  const { name, collar_serial_number, collar_version, birthdate, id_user } =
    req.body;
  const id_pet = req.params.id;

  let pet;

  const properties = {
    name,
    collar_serial_number,
    collar_version,
    birthdate,
  };
  deleteUndefinedProperties(properties);
  console.log("id_pet:", id_pet);
  console.log("properties:", properties);

  //* Update
  if (id_pet) {
    console.log("Update Pet");

    // TODO: [Issue #1] Check if the user making the request is admin or the pet owner

    if (collar_serial_number) {
      const petWithSameSerialNumber = await Pet.findOne({
        where: { collar_serial_number, id_pet: { [Op.ne]: id_pet } },
      });
      if (petWithSameSerialNumber) {
        // console.log("petWithSameSerialNumber:", petWithSameSerialNumber);
        return res.status(400).send("Um pet ja utiliza este serial number");
      }
    }

    pet = await Pet.findByPk(id_pet);
    if (pet === null) {
      res.status(404).send("Pet not found");
      return;
    }

    pet.set(properties);
  }

  //* Create
  else {
    // console.log("Create Pet");

    const petWithSameSerialNumber = await Pet.findOne({
      where: { collar_serial_number },
    });
    if (petWithSameSerialNumber) {
      return res.status(400).send("Um pet ja utiliza este serial number");
    }

    pet = Pet.build(properties);
  }

  //* Validation
  try {
    // Verify id_user
    if (id_user && !id_pet) {
      const user = await User.findByPk(id_user);
      if (user === null) {
        return res.status(404).send("User not found");
      }
    } else if (!id_user && !id_pet) {
      return res.status(400).send("O pet precisa de um dono");
    }

    await pet.validate();
    console.log("pet:", pet.dataValues);
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(400).send("[ERROR]\n" + error.message);
  }

  //* Save
  try {
    await pet.save();

    if (id_user && !id_pet) {
      await pet.addUser(id_user);
    }

    const safePet = {
      name: pet.name,
      collar_serial_number: pet.collar_serial_number,
      collar_version: pet.collar_version,
      birthdate: pet.birthdate,
      created_at: pet.created_at,
      updated_at: pet.updated_at,
    };

    id_pet ? res.status(204) : res.status(201);
    res.send(safePet);
    // res.send();
    return;
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(500).send("[ERROR]\n" + error.message);
  }
};

module.exports.delete = async (req, res) => {
  const id_pet = req.params.id;

  // TODO: [issue #1] check if the user making the request is admin or pet owner

  // Search pet
  const petToDelete = await Pet.findByPk(id_pet);
  if (!petToDelete) return res.status(404).send("Pet not found");

  // Delete
  try {
    await petToDelete.destroy();
    return res.status(204).send();
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(500).send("[ERROR]\n" + error.message);
  }
};

module.exports.restore = async (req, res) => {
  const id_pet = req.params.id;
  // console.log("id_pet:", id_pet);

  const petToRestore = await Pet.findByPk(id_pet, { paranoid: false });
  if (!petToRestore) return res.status(404).send("Pet not found");

  // Restore
  try {
    await petToRestore.restore();
    return res.status(204).send();
  } catch (error) {
    console.log("[ERROR]\n" + error.message);
    return res.status(500).send("[ERROR]\n" + error.message);
  }
};
