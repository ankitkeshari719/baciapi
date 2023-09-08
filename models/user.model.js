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
    companyName: {
      type: String,
    },
    role: {
      type: String,
    },
    team: {
      type: Array,
    },
    plan: {
      type: String,
    },
    enterpriseId: {
      type: String,
      required: true,
    },
    roleId: {
      type: String,
      required: true,
    },
    roleName: {
      type: String,
    },
    enterpriseName: {
      type: String,
    },
    isActive: {
      type: Boolean,
    },
    isEnterpriserRequested: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userModel);
