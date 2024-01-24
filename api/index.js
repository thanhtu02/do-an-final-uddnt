const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const app = express();
const port = 3000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://hanhee1406:hanhee1406@cluster0.ziwn4bb.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log("Error Connecting to MongoDB");
  });

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

const User = require("./models/user");
const Post = require("./models/post");

// register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // create new user here
    const newUser = new User({ name, email, password });
    // store verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");
    // save user to db
    await newUser.save();
    // send verification email to user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
    res
      .status(200)
      .json({
        message: "Register successful, please check your email for verification"
      });
  } catch (error) {
    console.log("Error registering user: ", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

const sendVerificationEmail = async ({ email, verificationToken }) => {
    // create nodemailer transporter 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "hanhee1406@gmail.com",
            password: ''
        }
    })
}
