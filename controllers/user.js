const db = require("../config/database");
const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");
const fs = import("fs");
__basedir = path.resolve(path.dirname(""));

const getDetails = (req, res, next) => {
  const { user_id } = req.query;
  console.log("This is user id", user_id);
  User.findOne({ where: { user_id } })
    .then((user) => {
      console.log(user);
      if (user) res.send(user);
      else res.send({ message: "No such User Found." });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      console.log(users);
      res.send(users);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const updateUser = (req, res, next) => {
  const { user_id, user_name, user_email, user_password } = req.body;
  User.update({ user_name, user_email, user_password }, { where: { user_id } })
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const getImage = async (req, res, next) => {
  const { user_id } = req.query;
  User.findOne({ where: { user_id } }).then(async (user) => {
    const imageDetails = await JSON.parse(user.user_image);
    const image = (await fs).readFileSync(
      __basedir + "/resources/static/assets/uploads/" + imageDetails.name
    );
    res.send("All Okay");
  });
};

const postUser = (req, res, next) => {
  console.log(req.body);
  const { user_name, user_email, user_password } = req.body;
  User.create({ user_name, user_email, user_password })
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const deleteUser = (req, res, next) => {
  const { user_id } = req.query;
  User.destroy({ where: { user_id } })
    .then((usersDeleted) => {
      console.log(usersDeleted);
      res.send({ totalDeleted: usersDeleted });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};
// Image Works

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/resources/static/assets/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

var uploadFile = multer({ storage: storage, fileFilter: imageFilter });

const uploadImage = async (req, res, next) => {
  try {
    console.log(req.file);
    await User.update(
      {
        user_image: {
          type: req.file.mimetype,
          name: req.file.originalname,
          data: (await fs).readFileSync(req.file.path),
        },
      },
      { where: { user_id: req.query.user_id } }
    );
    res.json({ message: "img saved" });
  } catch (err) {
    console.log(err);
    res.sendStatus(500).send(err);
  }
};

module.exports = {
  getDetails,
  updateUser,
  getImage,
  postUser,
  deleteUser,
  getAllUsers,
  uploadImage,
  uploadFile,
};
