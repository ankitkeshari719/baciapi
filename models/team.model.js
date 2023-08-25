const mongoose = require("mongoose");

const teamModel = mongoose.Schema(
  {
    teamId: {
      type: String,
      unique: true,
      required: true,
    },
    teamName: {
      type: String,
      required: true,
    },
    teamDepartment: {
      type: String,
    },
    teamDescription: {
      type: String,
      required: true,
    },
    enterpriseId: {
      type: String,
      required: true,
    },
    userEmailIds: {
      type: Array,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Team", teamModel);
