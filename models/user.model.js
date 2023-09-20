const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      index: true,
      unique: true,
      sparse: true,
    },
    phoneNo: {
      type: String,
    },
    name: {
      type: String,
    },
    country: {
      type: String,
    },
    cityCode: {
      type: String,
    },
    role: {
      type: String,
    },
    roleId: {
      type: String,
      required: true,
    },
    roleName: {
      type: String,
    },
    enterpriseId: {
      type: String,
    },
    enterpriseName: {
      type: String,
    },
    selectedAvatar: {
      type: String,
    },
    isEnterpriserRequested: {
      type: Boolean,
    },
    teams: {
      type: Array,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userModel);
