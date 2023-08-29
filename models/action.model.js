const mongoose = require("mongoose");

const actionModel = mongoose.Schema(
  {
    actionId: {
      type: String,
    },
    actionName: {
      type: String,
      required: true,
    },
    jiraId: {
      type: String,
    },
    retroId: {
      type: String,
      required: true,
    },
    teamId: {
      type: String,
    },
    assignedTo: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    status: {
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

module.exports = mongoose.model("Action", actionModel);
