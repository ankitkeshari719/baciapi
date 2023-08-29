const db = require("../_helpers/db");
const Team = db.Team;
const Action = db.Action;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getAllTeamsByEnterpriseId,
};

async function create(teamParam) {
  let teamId =
    teamParam.teamName.toString().replace(" ", "_").toLowerCase() +
    Math.random();
  // validate
  const tempTeam = await Team.findOne({ teamId: teamId });
  if (tempTeam) {
    teamId =
      teamParam.teamName.toString().replace(" ", "_").toLowerCase() +
      Math.random();
  }

  const requested_data = {
    teamId: teamId,
    teamName: teamParam.teamName,
    teamDepartment: teamParam.teamDepartment,
    teamDescription: teamParam.teamDescription,
    enterpriseId: teamParam.enterpriseId,
    userEmailIds: teamParam.userEmailIds,
    createdBy: teamParam.createdBy,
    isActive: teamParam.isActive,
  };

  const team = new Team(requested_data);

  // save team
  await team.save();
  return teamId;
}

async function getAll() {
  // const teams = await Team.find();
  // let finalData = [];
  // for (let i = 0; i < teams.length; i++) {
  //   let actions = await Action.find({ teamId: teams[i].teamId });
  //   console.log("actions", actions);
  //   finalData.push({ ...teams[i], actions: actions });
  // }
  // console.log("finalData", actions);
  return await Team.find();
}

async function getById(teamId) {
  return await Team.findOne({ teamId: teamId });
}

async function update(teamId, teamParam) {
  const team = await Team.findOne({ teamId: teamId });

  // validate
  if (!team) throw "Team not found";
  if (
    team.teamName !== teamParam.teamName &&
    (await Team.findOne({ teamName: teamParam.teamName }))
  ) {
    throw 'Team name "' + teamParam.teamName + '" is already taken';
  }

  // copy teamParam properties to team
  Object.assign(team, teamParam);

  await team.save();
  return team;
}

async function _delete(teamId) {
  const team = await Team.findOne({ teamId: teamId });

  // validate
  if (!team) throw "Team not found";

  await Team.deleteMany({ teamId: teamId });
}

async function getAllTeamsByEnterpriseId(enterpriseId) {
  return await Team.find({ enterpriseId: enterpriseId });
}
