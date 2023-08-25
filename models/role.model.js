const mongoose = require("mongoose");

const roleModel = mongoose.Schema(
  {
    roleId: {
      type: String,
      unique: true,
    },
    roleName: {
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

module.exports = mongoose.model("Role", roleModel);
