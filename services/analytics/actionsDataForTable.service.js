const db = require("../../_helpers/db");
const usersDB = db.User;
const teamsDB = db.Team;
const actionsDB = db.Action;
const { JIRA_STATUS, ROLE_NAME } = require("../../_helpers/const");
async function getActionsDataForTable(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  var teamIds = [];
  // let timestamp1 = new Date(req.body.fromDate).getTime();
  // let timestamp2 = new Date(req.body.toDate).getTime();

  var enableMatch=true

  if (roleName == ROLE_NAME.ENTERPRISE_ADMIN) {
    enableMatch=false;
  } else {
    // const user = await usersDB.find({ emailId: id });
    // teamIds = user && user[0] ? user[0].teams : [];
    enableMatch=true;
    // if (teamIds == []) {
    //   return {
    //     actionsData: teamActionsData,
    //   };
    // }
  }

  const result = actionsDB.aggregate([
    {
      $match: {
        // Add your existing $match conditions here
        isActive: true,
        enterpriseId: enterpriseId,
        $expr: {
          $cond: {
            if: enableMatch, // Condition to enable or disable the $match stage
            then: {
              $in: ["$assignedTo", [id]],
            },
            else: {},
          },
        }
      }
    },
    {
      $sort: {
        updatedAt: -1 // Sort by updatedAt in descending order
      }
    },
    {
      $group: {
        _id: "$actionId", // Group by the actionId field
        latestDocument: { $first: "$$ROOT" } // Select the latest document in each group
      }
    },
    {
      $replaceRoot: {
        newRoot: "$latestDocument" // Replace the root with the latest document in each group
      }
    }
 ,
    {
      $lookup: {
        from: "users",
        localField: "assignedTo",
        foreignField: "emailId",
        as: "userObj",
      },
    },
    {
      $lookup: {
        from: "retros",
        localField: "retroId",
        foreignField: "humanId",
        as: "retroData",
      },
    },
    {
      $lookup: {
        from: "teams",
        localField: "teamId",
        foreignField: "teamId",
        as: "teamData",
      },
    },

    {
      $project: {
        actionId: 1,
        actionName: 1,
        jiraId: 1,
        retroId: 1,
        teamId: 1,
        assignedTo: 1,
        createdBy: 1,
        status: 1,
        isActive: 1,
        jiraUrl: 1,
        enterpriseId: 1,
        createdAt: 1,
        updatedAt: 1,
        jiraKey:1,
        avatar:{ $arrayElemAt: ["$userObj.selectedAvatar", 0] },
        assigneeFName:{ $arrayElemAt: ["$userObj.firstName", 0]  },
        assigneeLName:{ $arrayElemAt: ["$userObj.lastName", 0] },
        initialSession: { $arrayElemAt: ["$retroData.name", 0] },
        teamName: { $arrayElemAt: ["$teamData.teamName", 0] },
        department:{ $arrayElemAt: ["$teamData.teamDepartment", 0] }
        // Add other fields from retros collection as needed
      },
    },
  ]);

  return result;
}

module.exports = {
  getActionsDataForTable,
};
