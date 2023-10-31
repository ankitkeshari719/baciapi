const db = require("../_helpers/db");
const Notification = db.Notification;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  addEnterpriseRequestNotification,
  getAllValidNotification,
  markAllNotificationById
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
    organisationId: notificationParam.organisationId,
    fromId: notificationParam.fromId,
    toId: notificationParam.toId,
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

async function addEnterpriseRequestNotification(notificationParam) {
  for (let i = 0; i < notificationParam.toId.length; i++) {
    const notificationId =
      notificationParam.type.toString().replace(" ", "_").toLowerCase() +
      Math.random();

    const requested_data = {
      notificationId: notificationId,
      type: notificationParam.type,
      organisationId: notificationParam.organisationId,
      fromId: notificationParam.fromId,
      toId: notificationParam.toId[i],
      isRead: false,
    };

    const notification = new Notification(requested_data);
    await sendEmailsToUsers(req.body.toId,"Enterprise Admin Account Requested","Please login the BACI Portal to accept the request of users");

    await notification.save();
  }
}

async function getAllValidNotification(notificationParam) {
  const notifications = await Notification.aggregate([
    {
      $match: {
        organisationId: notificationParam.organisationId,
        toId: notificationParam.userId,
        isRead: false,
      },
    },
    {
      $unwind: {
        path: "$users",
        preserveNullAndEmptyArrays: true, // Preserve empty arrays
      },
    },
    {
      $lookup: {
        from: "users", // The name of the "users" collection
        localField: "fromId",
        foreignField: "emailId",
        as: "fromUserDetails",
      },
    },
    {
      $lookup: {
        from: "users", // The name of the "users" collection
        localField: "toId",
        foreignField: "emailId",
        as: "toUserDetails",
      },
    },
  ]);

  return notifications;
}

async function markAllNotificationById(userParam) {
  await User.updateMany(
    { toId: { $in: userParam.userId } },
    { $set: { isRead: true } },
    { multi: true }
  );
}
