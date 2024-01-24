const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/user");
const Post = require("./models/post");

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get("/", (req, res) => {
  res.send("Local host ");
});

// register
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    // create new user here
    const newUser = new User({name,email,password});
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

const sendVerificationEmail = async (email, verificationToken) => {
    // create nodemailer transporter 
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hanhee1406@gmail.com",
        pass: "avliwgjxjzyzxhik"
      }
    });
    // compose email message
    const mailOptions = {
        from: "socialnetwork.com",
        to: email,
        subject: "Email Verification",
        text: `Please click the following link to verify your email http://localhost:3000/verify/${verificationToken}`
    }
    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("Error sending email: " , error)
    }
}

app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token
        const user = await User.findOne({ verificationToken:token })
        if (!user) {
            return res.status(400).json({message: 'Invalid token'})
        }
        user.verified = true
        user.verificationToken = undefined
        await user.save()
        res.status(200).json({message: "Email verify successfully"})
    } catch (error) {
        console.log('Error getting token', error)
        res.status(500).json({message: "Email verification failed"})
    }
})

// secrect key here
const generateSecretKey = () => {
    const secrectKey = crypto.randomBytes(32).toString('hex')
    return secrectKey
}
const secrectKey = generateSecretKey()

//login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({email})
        if (!user) {
            return res.status(404).json({message: "Invalid email"})
        }
        if (user.password !== password) {
          return res.status(404).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, secrectKey)
        res.status(200).json({token})
    } catch (error) {
        res.status(500).json({ message: "Login failed" });
    }
})
