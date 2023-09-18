const db = require("../../_helpers/db");
const usersDB = db.User;
const teamsDB = db.Team;
const actionsDB = db.Action;
const retroDB = db.Retro;
const { ROLE_NAME } = require("../../_helpers/const");

async function getTeamDataForTable(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  var teamIds = [];
  // let timestamp1 = new Date(req.body.fromDate).getTime();
  // let timestamp2 = new Date(req.body.toDate).getTime();

  if (roleName == ROLE_NAME.ENTERPRISE_ADMIN) {
  } else {
    const user = await usersDB.find({ emailId: id });
    teamIds = user && user[0] ? user[0].teams : [];
    console.log(teamIds);
    if (teamIds == []) {
      return {
        actionsData: teamActionsData,
      };
    }
  }

  var queryForTeamsData = [
    {
      $match: {
        // timestamp: {
        //   $gte: timestamp1,
        //   $lte: timestamp2,
        // },

        enterpriseId: enterpriseId,
        $expr: {
          $cond: {
            if: "$$enableMatch", // Condition to enable or disable the $match stage
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
        from: "users", // The name of the "users" collection
        localField: "userEmailIds",
        foreignField: "emailId",
        as: "userDetails",
      },
    },
    {
      $project: {
        teamId: "$teamId",
        createdBy: "$createdBy",
        teamName: "$teamName",
        createdAt: "$createdAt",
        teamDepartment: "$teamDepartment",

        users: {
          $map: {
            input: "$userEmailIds",
            as: "emailId",
            in: {
              $arrayElemAt: [
                {
                  $filter: {
                    input: "$userDetails",
                    as: "user",
                    cond: { $eq: ["$$user.emailId", "$$emailId"] },
                  },
                },
                0,
              ],
            },
          },
        },
      },
    },
  ];

  queryForTeamsData[0].$match.$expr.$cond.if =
    roleName == ROLE_NAME.ENTERPRISE_ADMIN ? false : true;
  var queryForRetroGroupData = [
    {
      $match: {
        // timestamp: {
        //   $gte: timestamp1,
        //   $lte: timestamp2,
        // },
        //   teamId: { $in: teamIds },
        enterpriseId: enterpriseId,
      },
    },
    {
      $group: {
        _id: "$teamId", // Group by the "groupId" field
        retroList: {
          $push: "$$ROOT", // Push the entire document into the "objects" array
        },
      },
    },
  ];
  var queryForActionGroupData = [
    {
      $match: {
        enterpriseId: enterpriseId,
      },
    },
    {
      $group: {
        _id: "$teamId", // Group by the "groupId" field
        actionList: {
          $push: "$$ROOT", // Push the entire document into the "objects" array
        },
      },
    },
  ];

  var data = await teamsDB.aggregate(queryForTeamsData);

  const retroGroupData = await retroDB.aggregate(queryForRetroGroupData);

  const actionGroupData = await actionsDB.aggregate(queryForActionGroupData);

  for (var i = 0; i < data.length; i++) {
    team = data[i];

    team.createdByObj = await usersDB.find({ emailId: team.createdBy });
    retroGroupData.forEach((retros) => {
      if (team.teamId == retros._id) {
        if (retros.retroList != undefined) {
          if (retros.retroList.length == 0) {
            team.retroCount = 0;
            team.retros = [];
          } else {
            team.retroCount = retros.retroList.length;
            team.retros = retros.retroList;
          }
        }
      }
    });

    actionGroupData.forEach((actions) => {
      if (team.teamId == actions._id) {
        team.actionsCount = actions.actionList.length;
        team.actions = actions.actionList;
      }
    });
  }

  return data;
}

module.exports = {
  getTeamDataForTable,
};
