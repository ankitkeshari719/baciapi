const db = require("../_helpers/db");
const Action = db.Action;
const Notification = db.Notification;
const {
  ADDED_IN_NEW_ACTION
} = require("./../_helpers/const");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function create(actionParam) {
  let actionId =
    actionParam.actionName.toString().replace(" ", "_").toLowerCase() +
    Math.random();

  // validate
  const tempAction = await Action.findOne({
    actionId: actionId,
  });
  if (tempAction) {
    actionId =
      actionParam.actionName.toString().replace(" ", "_").toLowerCase() +
      Math.random();
  }

  const requested_data = {
    actionId: actionParam.actionId,
    actionName: actionParam.actionName,
    jiraId: actionParam.jiraId,
    retroId: actionParam.retroId,
    retroIdEnc: actionParam.retroIdEnc,
    enterpriseId: actionParam.enterpriseId,
    assignedTo: actionParam.assignedTo,
    createdBy: actionParam.createdBy,
    jiraUrl: actionParam.jiraUrl,
    status: actionParam.status,
    isActive: actionParam.isActive,
    teamId: actionParam.teamId,
  };

  const action = new Action(requested_data);

  // save action
  await action.save();

  if (assignedTo === "") {
    const notificationId =
     ADDED_IN_NEW_ACTION.replace(" ", "_").toLowerCase() + Math.random();
    // Created : Actions has been created
    const notificationRequest = {
      notificationId: notificationId,
      type:ADDED_IN_NEW_ACTION,
      organisationId: enterpriseId,
      fromId: createdBy,
      toId: "",
      isRead: false,
    };

    const notification = new Notification(notificationRequest);

    // save notification
    await notification.save();
  } else {
    const notificationId =
     ADDED_IN_NEW_ACTION.replace(" ", "_").toLowerCase() + Math.random();
    // Created :
    // AssignTo
    const notificationRequest = {
      notificationId: notificationId,
      type:ADDED_IN_NEW_ACTION,
      organisationId: enterpriseId,
      fromId: createdBy,
      toId: assignedTo,
      isRead: false,
    };

    const notification = new Notification(notificationRequest);

    // save notification
    await notification.save();
  }
  return actionId;
}

async function getAll() {
  return await Action.find();
}

async function getById(actionId) {
  return await Action.findOne({ actionId: actionId });
}

async function update(actionId, actionParam) {
  const action = await Action.findOne({ actionId: actionId });

  // validate
  if (!action) throw "Action not found";

  // copy actionParam properties to action
  Object.assign(action, actionParam);

  await action.save();
  return action;
}

async function _delete(actionId) {
  const action = await Action.findOne({ actionId: actionId });

  // validate
  if (!action) throw "Action not found";

  await Action.deleteMany({ actionId: actionId });
}
