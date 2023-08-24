const mongoose = require("mongoose");

const enterpriseModel = mongoose.Schema(
  {
    enterpriseId: {
      type: String,
    },
    enterpriseName: {
      type: String,
      required: true,
    },
    enterpriseDomain: {
      type: String,
    },
    enterpriseAddress: {
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

module.exports = mongoose.model("Enterprise", enterpriseModel);
