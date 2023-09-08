const mongoose = require("mongoose");

const notificationModel = mongoose.Schema(
  {
    notificationId: {
      type: String,
      unique: true,
    },
    type: {
      type: String,
    },
    userId: {
      type: String,
    },
    organisationId: {
      type: String,
    },
    description: {
      type: String,
    },
    From: {
      type: String,
    },
    To: {
      type: Array,
    },
    isRead: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationModel);
