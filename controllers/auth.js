const jwt = require("jsonwebtoken");
const SECRET_JWT = "jibber jabber";

const authMiddleware = (req, res, next) => {
  const token = req.body.token || req.headers["x-access-token"];
  if (!token) {
    return res
      .sendStatus(400)
      .json({ msg: "An access token is required. Please try again." });
  }

  try {
    const decode = jwt.verify(token, SECRET_JWT);
    req.user = decode;
    console.log("FROM AUTH ", decode);
  } catch (err) {
    res.status(401).send({ message: "Error Decoding Token", err });
  }
  next();
};

module.exports = { authMiddleware };
