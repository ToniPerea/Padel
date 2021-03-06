const mongoose = require("mongoose");
const crypto = require("crypto");
// user schema
const userScheame = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    surname: {
      type: String,
      trim: true,
      required: true,
      max: 32
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: Number,
      trim: true,
      required: true,
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String, // esto es para ver que nivel de seguridad se le dara al hash
    role: {
      type: String,
      default: "subscriber"
    },
    resetPassworkdLink: {
      data: String,
      default: ""
    },
  },
  { timestamps: true }
);

// virtual
userScheame
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userScheame.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) == this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf ^ Math.random()) + "";
  },
};

module.exports = mongoose.model('User', userScheame);
