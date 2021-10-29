const express = require("express");
const app = express();
const User = require("./models/user.model");
const cors = require("cors");
const db = require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
app.put("/update", updateUser);
app.get("/image", getImage);
app.post("/insert", postUser);
app.delete("/delete", deleteUser);
app.post("/image", uploadFile.single("image"), uploadImage);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
