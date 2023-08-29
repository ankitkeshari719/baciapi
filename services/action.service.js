const db = require("../_helpers/db");
const Action = db.Action;

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
    actionId: actionId,
    actionName: actionParam.actionName,
    jiraId: actionParam.jiraId,
    retroId: actionParam.retroId,
    assignedTo: actionParam.assignedTo,
    createdBy: actionParam.createdBy,
    status: actionParam.status,
    isActive: actionParam.isActive,
    teamId: actionParam.teamId,
  };

  const action = new Action(requested_data);

  // save action
  await action.save();
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
