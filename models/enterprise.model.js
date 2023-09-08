const mongoose = require("mongoose");

const enterpriseModel = mongoose.Schema(
  {
    organisationId: {
      type: String,
    },
    organisationPhoto: {
      type: String,
    },
    organisationName: {
      type: String,
      required: true,
    },
    organisationDomain: {
      type: Array,
      required: true,
    },
    organisationCountry: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Enterprise", enterpriseModel);
