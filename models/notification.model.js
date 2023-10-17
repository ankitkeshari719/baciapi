const mongoose = require("mongoose");

const notificationModel = mongoose.Schema(
  {
    notificationId: {
      type: String,
      unique: true,
    },
    // Request For Admin, Included In Team, Session Created
    type: {
      type: String,
    },
    organisationId: {
      type: String,
    },
    fromId: {
      type: String,
    },
    toId: {
      type: String,
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
