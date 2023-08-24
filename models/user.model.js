const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    emailId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
    },
    mobileNo: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    enterpriseId: {
      type: String,
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userModel);
