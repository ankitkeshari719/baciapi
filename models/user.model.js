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
    teams: {
      type: Array,
    },
    plan: {
      type: String,
    },
    enterpriseId: {
      type: String,
    },
    enterpriseName: {
      type: String,
    },
    enterprisePhoto: {
      type: String,
    },
    roleId: {
      type: String,
      required: true,
    },
    roleName: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    isEnterpriserRequested: {
      type: Boolean,
    },
    selectedAvatar: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userModel);
