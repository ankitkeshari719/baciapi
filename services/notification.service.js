const db = require("../_helpers/db");
const Notification = db.Notification;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await Notification.find();
}

async function getById(notificationId) {
  const notification = await Notification.findOne({
    notificationId: notificationId,
  });
  return notification;
}

async function create(notificationParam) {
  const notificationId =
    notificationParam.type.toString().replace(" ", "_").toLowerCase() +
    Math.random();

  const requested_data = {
    notificationId: notificationId,
    type: notificationParam.type,
    userId: notificationParam.userId,
    organisationId: notificationParam.organisationId,
    description: notificationParam.description,
    From: notificationParam.From,
    To: notificationParam.To,
    isRead: notificationParam.isRead,
  };

  const notification = new Notification(requested_data);

  // save notification
  await notification.save();
  return notificationId;
}

async function update(notificationId, notificationParam) {
  const notification = await Notification.findOne({
    notificationId: notificationId,
  });

  // validate
  if (!notification) throw "Notification not found";

  // copy notificationParam properties to notification
  Object.assign(notification, notificationParam);

  await notification.save();
  return notification;
}

async function _delete(notificationId) {
  const notification = await Notification.findOne({
    notificationId: notificationId,
  });

  // validate
  if (!notification) throw "Notification not found";

  await Notification.deleteMany({ notificationId: notificationId });
}
