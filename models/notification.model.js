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
    fromName: {
      type: String,
    },
    fromId: {
      type: String,
    },
    fromTeam: {
      type: String,
    },
    description: {
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
