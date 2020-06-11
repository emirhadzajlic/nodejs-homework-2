const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

const Teacher = require("./models/teacher");

async function createToken(req, res) {
  try {
    const user = {
      username: req.query.username,
      password: cryptojs.AES.encrypt(
        "My message!",
        req.query.password
      ).toString(),
    };

    const found = await Teacher.find({
      username: user.username,
      password: user.password,
    });

    if (found) {
      jwt.sign(
        { user },
        process.env.SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          res.json({ token });
        }
      );
    } else {
      res.json({ error: "incorrect username or password" });
    }
  } catch (err) {
    res.status(403).json({ error: "Auth failed!" });
  }
}

function verifyToken(req, res, next) {
  const bh = req.headers["authorization"];
  if (typeof bh !== "undefined") {
    req.token = bh.split(" ")[1];
    jwt.verify(req.token, process.env.SECRET, (err, auth) => {
      if (err) {
        res.status(403).json({ error: "Authentication failed!" });
        return;
      }
      next();
    });
  } else {
    console.log("error");
    res.sendStatus(403);
  }
}

module.exports = {
  createToken,
  verifyToken,
};
