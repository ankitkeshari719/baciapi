const mongoose = require("mongoose");
const connectionOptions = {
  dbName: `bacidb`,
};
mongoose.connect(process.env.COSMOS_CONNECTION_STRING, connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
  Role: require("../models/role.model"),
  User: require("../models/user.model"),
  Team: require("../models/team.model"),
  Enterprise: require("../models/enterprise.model"),
  Action: require("../models/action.model"),
  Notification: require("../models/notification.model"),
  isValidId,
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
