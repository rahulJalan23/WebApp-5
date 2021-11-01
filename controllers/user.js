const db = require("../config/database");
const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
__basedir = path.resolve(path.dirname(""));
const jwt = require("jsonwebtoken");
const { PORT } = require("../config/config");
const SECRET_JWT = "jibber jabber";
// const SECRET_PASS = "myname";

const getDetails = (req, res, next) => {
  const { user_id } = req.query;
  // console.log("This is user id", user_id);
  User.findOne({ where: { user_id } })
    .then((user) => {
      // console.log(user);
      if (user) res.send(user);
      else return res.send({ message: "No such User Found." });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      users.map((user) => console.log(user.user_image));
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

  if (req.user.user_id != user_id || !user_id) {
    return res.send({ msg: "Provide a valid access token." });
  }
  if (user_id) user_id = req.user.user_id;

  User.update({ user_name, user_email, user_password }, { where: { user_id } })
    .then((user) => {
      console.log(user);
      res.send({ message: "User Updated Successfully." });
    })
    .catch((err) => {
      console.log(err);
      res.send({ err, message: "User Update Failed. Try again." });
    });
};

const getImage = async (req, res, next) => {
  try {
    const user_id = req.query.user_id || req.body.user_id;

    if (!user_id) {
      throw new Error("User Id is not given. Please provide the User Id.");
    }

    User.findOne({ where: { user_id } })
      .then(async (user) => {
        const imageDetails = await JSON.parse(user.user_image);
        // const image = (await fs).readFileSync(
        //   `${__basedir}\\resources\\static\\assets\\uploads\\${imageDetails.name}`
        // );
        console.log(req.hostname, req.path);
        //  -> SENDS IMAGE URL
        res.send({
          image_url: `http://${req.hostname}:${PORT}/static/assets/uploads/${imageDetails.name}`,
        });

        // ->SEND IMAGE FILE BACK
        // res.render(`./static/assets/uploads/${imageDetails.name}`);

        //  -> SENDS IMAGE DATA
        // res.send(imageDetails.data.data);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const postUser = (req, res, next) => {
  const { user_name, user_email, user_password } = req.body;
  if (!user_name || !user_email || !user_password) {
    res
      .status(400)
      .send({ msg: "Username, Email and Password are Mandatory fields." });
  } else if (user_password.length < 8) {
    res.json({ msg: "Password should be atleast 8 letters." });
  } else {
    User.create({ user_name, user_email, user_password })
      .then(async (user) => {
        const token = await jwt.sign({ user_id: user.user_id }, SECRET_JWT);
        res
          .status(201)
          .send({ message: "User Created Successfully.", user, token });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
};

const deleteUser = (req, res, next) => {
  const { user_id } = req.query;
  User.destroy({ where: { user_id } })
    .then((usersDeleted) => {
      if (usersDeleted) {
        res.send({
          totalDeleted: usersDeleted,
          message: "User Deleted Successfully.",
        });
      } else {
        res.json({ totalDeleted: usersDeleted, message: "No User Deleted." });
      }
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
    console.log(req.query);
    const user_image = JSON.stringify({
      type: req.file.mimetype,
      original_name: req.file.originalname,
      name: req.file.filename,
      // data: (await fs).readFileSync(req.file.path),
    });
    console.log(user_image);
    await User.update(
      {
        user_image,
      },
      { where: { user_id: req.query.user_id } }
    );
    res.json({
      message: "Img Saved Successfully.",
      image_url: `http://${req.hostname}:${PORT}/static/assets/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
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
