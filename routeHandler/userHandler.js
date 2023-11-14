const express = require("express");
const router = express.Router();
const userSchema = require("../Schemas/userSchema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
router.use(express.json());

const USER = new mongoose.model("USER", userSchema);

router.post("/signup", async (req, res) => {
  try {
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const newUser = new USER({
      name: req.body.name,
      username: req.body.username,
      password: hashedPass,
    }); //instance needed to call .save() for single post
    await newUser.save();
    res.status(200).json({ message: "Signedup successfully" });
  } catch (error) {
    console.error("Error saving todo:", error);
    res.status(500).json({ error: "Signup failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await USER.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPass = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPass) {
        const token = jwt.sign(
          {
            userName: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        res.status(200).json({
          acces_token: token,
          message: "login_successful",
        });
      } else {                         //IF PASS ISNT VALID
        res.status(401).json({
          error: "authentication error",
        });
      }
    } else {
      res.status(401).json({           //IF USER NOT FOUND
        error: "authentication error",
      });
    }
  } catch {
    res.status(401).json({
      error: "authentication error",
    });
  }
});

module.exports = router;
