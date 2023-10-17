const db = require("../../_helpers/db");
const usersDB = db.User;
const teamsDB = db.Team;
const actionsDB = db.Action;

const retroDB = db.Retro;
const { JIRA_STATUS, ROLE_NAME } = require("../../_helpers/const");
async function getSessionsDataForTable(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  var teamIds = [];
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();

  var enableMatch = true;

  if (roleName == ROLE_NAME.ENTERPRISE_ADMIN && teamId == 0) {
    enableMatch = false;
  } else {
    if (teamId != 0) {
      teamIds = [teamId];
      enableMatch = true;
    } else {
      const user = await usersDB.find({ emailId: id });
      teamIds = user && user[0] ? user[0].teams : [];
      enableMatch = true;
      if (teamIds == []) {
        return {
          actionsData: teamActionsData,
        };
      }
    }
  }

  const result = retroDB.aggregate([
    {
      $match: {
        timestamp: {
          $gte: timestamp1,
          $lte: timestamp2,
        },
        //   isActive: true,
        enterpriseId: enterpriseId,
        $expr: {
          $cond: {
            if: enableMatch, // Condition to enable or disable the $match stage
            then: {
              $in: ["$teamId", teamIds],
            },
            else: {},
          },
        },
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "teamId",
        foreignField: "teamId",
        as: "teamInfo",
      },
    },
    {
      $unwind: "$teamInfo",
    },
    {
      $project: {
        retroId: 1,
        name: 1,
        humanId: 1,
        joinUrl: 1,
        creatorId: 1,
        timestamp: 1,
        facilitatorId: 1,
        teamId: 1,
        retroStatus: 1,
        teamName: "$teamInfo.teamName",
        teamDepartment: "$teamInfo.teamDepartment",
        userEmailIds: "$teamInfo.userEmailIds",
        selectedTemplate:1,
        selectedPulseCheck:1,
        isLoginUser:1
        // action:1
      },
    },
  ]);

  return result;
}

module.exports = {
  getSessionsDataForTable,
};
