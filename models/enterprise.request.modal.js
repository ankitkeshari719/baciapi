const mongoose = require("mongoose");

const enterpriseRequestModel = mongoose.Schema(
  {
    enterpriseRequestId: {
      type: String,
      unique: true,
    },
    organisationId: {
      type: String,
    },
    fromName: {
      type: String,
    },
    fromEmail: {
      type: String,
    },
    fromTeams: {
      type: Array,
    },
    toEmails: {
      type: Array,
    },
    isApproved: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EnterpriseRequest", enterpriseRequestModel);
