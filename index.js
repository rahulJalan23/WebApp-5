const express = require("express");
const app = express();
const User = require("./models/user.model");
const cors = require("cors");
const db = require("./config/database");
const exphbs = require("express-handlebars");
const { authMiddleware } = require("./controllers/auth");
const { PORT } = require("./config/config");

app.use(express.static("resources"));

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
  })
);
app.set("view engine", "hbs");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  const host = req.hostname;

  User.findAll()
    .then((users) => {
      users = JSON.parse(JSON.stringify(users));
      // console.log(users);
      users.map((user) => {
        if (user.user_image) {
          user.image_url = `http://${host}/static/assets/uploads/${
            JSON.parse(user.user_image).name
          }`;
        } else {
          user.image_url = null;
        }
      });
      res.render("index", {
        users,
        host,
      });
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

const {
  getDetails,
  updateUser,
  getImage,
  postUser,
  deleteUser,
  getAllUsers,
  uploadImage,
  uploadFile,
} = require("./controllers/user");

app.get("/details", getDetails);
app.get("/getallusers", getAllUsers);
app.put("/update", authMiddleware, updateUser);
app.get("/image", getImage);
app.post("/insert", postUser);
app.delete("/delete", deleteUser);
app.post("/image", uploadFile.single("image"), uploadImage);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
