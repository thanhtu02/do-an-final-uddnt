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
    res.status(200).json({
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
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

// lay token cua user 
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).json({ message: "Email verify successfully" });
  } catch (error) {
    console.log("Error getting token", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

// secrect key here
const generateSecretKey = () => {
  const secrectKey = crypto.randomBytes(32).toString("hex");
  return secrectKey;
};
const secrectKey = generateSecretKey();

//login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    if (user.password !== password) {
      return res.status(404).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, secrectKey);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// lay danh sach user tru tk cua minh dang dang nhap
app.get("/user/:userId", (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    User.find({ _id: { $ne: loggedInUserId } })
      .then(users => {
        res.status(200).json(users);
      })
      .catch(err => {
        console.log("Error :", err);
        res.status(500).json("Error");
      });
  } catch (err) {
    res.status(500).json({ message: "Error getting the users except me" });
  }
});

// lay danh sach tat ca user
app.get("/get-users", async (req, res) => {
  try {
    const users = await User.find().select("name").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error getting all users:", err);
    res.status(500).json({ message: "Error getting all users" });
  }
});

// follow user
app.post("/follow", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;
  try {
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { followers: currentUserId }
    });
    res.status(200).json({ message: "Following successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).json({ message: "Error in following a user" });
  }
});

// unfollow user
app.post("/users/unfollow", async (req, res) => {
  const { loggedInUserId, targetUserId } = req.body;
  try {
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: loggedInUserId }
    });
    res.status(200).json({ message: "Unfollow sucessfully" });
  } catch (err) {
    res.status(500).json({ message: "Error in unfollowing a user" });
  }
});

// tao bai viet
app.post("/create-post", async (req, res) => {
  try {
    const { content, userId } = req.body;
    const newPostData = {
      user: userId
    };
    if (content) {
      newPostData.content = content;
    }
    const newPost = new Post(newPostData);
    await newPost.save();
    res.status(200).json({ message: "Post successfully" });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).json({ message: "Error creating post" });
  }
});


// xoa bai viet
app.delete("/post/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    await post.deleteOne();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Error deleting post" });
  }
});

// like bai viet
app.put("/post/:postId/:userId/like", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId).populate("user", "name");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    updatedPost.user = post.user;
    res.json(updatedPost);
  } catch (err) {
    console.log("Error :", err);
    res.status(500).json({ message: "Error liking post" });
  }
});

// unlike bai viet
app.put("/post/:postId/:userId/unlike", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;
    const post = await Post.findById(postId).populate("user", "name");
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    updatedPost.user = post.user;
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (err) {
    console.log("Error :", err);
    res.status(500).json({ message: "Error unliking post" });
  }
});

// lay danh sach tat ca cac bai viet
app.get("/get-posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.log("Error :", err);
    res.status(500).json({ message: "Error getting all posts" });
  }
});

// profile user
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.log("Error :", err);
    res.status(500).json({ message: "Error getting profile" });
  }
});


// tao comment bai viet
app.post("/post/:postId/:userId/create-reply", async (req, res) => {
  try {
    const { reply, userId } = req.body;
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.replies.push({
      user: userId,
      content: reply
    });
    await post.save();
    res.status(200).json({ message: "Replying post successfully" });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Error replying post" });
  }
});

// lay danh sach tat ca comment cua 1 bai viet 
app.get("/post/:postId/replies", async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post.replies);
  } catch (err) {
    console.error("Error fetching replies:", err);
    res.status(500).json({ message: "Error  fetching replies" });
  }
});

// lay nhung followers cua user
app.get("/followed-users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("followers", "name"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.followers);
  } catch (err) {
    console.error("Error fetching followed users:", err);
    res.status(500).json({ message: "Error fetching followed users" });
  }
});