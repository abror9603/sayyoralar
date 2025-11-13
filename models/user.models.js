const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const Users = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Pleace enter valid email address!",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    apiKey: {
      type: String,
      unique: true,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hashing password with bcrypt

Users.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Generate jwt token
Users.methods.generateJwtToken = function(){
  return jwt.sign({id: this._id, email: this.email}, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Check password that users enter password

Users.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = model("User", Users);
