const mongoose = require("mongoose");

const userSchema = new mongoose.SchemaType({
  name: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePicture: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  sentFollowRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  receivedFollowRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
    Followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
    ],
    verified: {
        type: Boolen,
        default: false
    },
    verificationToken: String,
})

const User = mongoose.models("User", userSchema)
module.exports = User