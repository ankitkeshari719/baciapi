const db = require("../../_helpers/db");
const usersDB = db.User;

const retroDB = db.Retro;
const { ROLE_NAME } = require("../../_helpers/const");
const month = require("../../utils/getMonthRange");
const { resource } = require("../..");

async function getParticipantMoodCount(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();
  let monthsWithinRange = month.getMonthRange(timestamp1, timestamp2);

  var aggregationPipeline = [];
  if (ROLE_NAME.ENTERPRISE_ADMIN == roleName) {
    if (teamId == "0") {
      aggregationPipeline = [
        {
          $match: {
            timestamp: {
              $gte: timestamp1,
              $lte: timestamp2,
            },
            enterpriseId: enterpriseId,
          },
        },
        {
          $project: {
            yearMonth: {
              $dateToString: {
                format: "%Y-%m",
                date: {
                  $toDate: "$timestamp",
                },
              },
            },
            data: "$$ROOT",
          },
        },
        {
          $group: {
            _id: "$yearMonth", // Group by year and month
            data: { $push: "$data" }, // Push the entire document into the 'data' array
          },
        },
      ];
    } else {
      aggregationPipeline = [
        {
          $match: {
            timestamp: {
              $gte: timestamp1,
              $lte: timestamp2,
            },
            teamId: teamId,
            enterpriseId: enterpriseId,
          },
        },
        {
          $project: {
            yearMonth: {
              $dateToString: {
                format: "%Y-%m",
                date: {
                  $toDate: "$timestamp",
                },
              },
            },
            data: "$$ROOT",
          },
        },
        {
          $group: {
            _id: "$yearMonth", // Group by year and month
            data: { $push: "$data" }, // Push the entire document into the 'data' array
          },
        },
      ];
    }
  } else {
    if (ROLE_NAME.REGULAR_ENTERPRISE == roleName) {
      if (teamId == "0") {
        const user = await usersDB.find({ emailId: id });
        const teamIds = user && user[0] ? user[0].teams : [];
        if (teamIds==undefined||teamIds == []) {
          return [];
        }

        aggregationPipeline = [
          {
            $match: {
              timestamp: {
                $gte: timestamp1,
                $lte: timestamp2,
              },
              teamId: { $in: teamIds },
              enterpriseId: enterpriseId,
            },
          },
          {
            $project: {
              yearMonth: {
                $dateToString: {
                  format: "%Y-%m",
                  date: {
                    $toDate: "$timestamp",
                  },
                },
              },
              data: "$$ROOT",
            },
          },
          {
            $group: {
              _id: "$yearMonth", // Group by year and month
              data: { $push: "$data" }, // Push the entire document into the 'data' array
            },
          },
        ];
      } else {
        aggregationPipeline = [
          {
            $match: {
              timestamp: {
                $gte: timestamp1,
                $lte: timestamp2,
              },
              teamId: teamId,
              enterpriseId: enterpriseId,
            },
          },
          {
            $project: {
              yearMonth: {
                $dateToString: {
                  format: "%Y-%m",
                  date: {
                    $toDate: "$timestamp",
                  },
                },
              },
              data: "$$ROOT",
            },
          },
          {
            $group: {
              _id: "$yearMonth", // Group by year and month
              data: { $push: "$data" }, // Push the entire document into the 'data' array
            },
          },
        ];
      }
    }
  }

  let retroData = await retroDB.aggregate(aggregationPipeline);
  let output = [];
  monthsWithinRange.forEach((month) => {
    var retroDataObj = {
      month: month,
      pulseCheck: [],
      pulseCheckChartData: [],
    };
    retroData.forEach((retroArray) => {
      if (month == retroArray._id) {
        retroArray.data.forEach((retro) => {
          retro.action.forEach((action) => {
            if (
              action.actionName == "submitPulseCheck" &&
              action.userId != ""
            ) {
              retroDataObj.pulseCheck.push(action.parameters.questions);
            }
          });
        });
      }
    });
    var pulseFinal = [
      { questionId: "0", star0: 0, star1: 0, star2: 0, star3: 0 },
      { questionId: "1", star0: 0, star1: 0, star2: 0, star3: 0 },
      { questionId: "2", star0: 0, star1: 0, star2: 0, star3: 0 },
    ];

    retroDataObj.pulseCheck.forEach((pulse) => {
      pulse.forEach((question) => {
        switch (question.id) {
          case "0":
            switch (question.entry) {
              case 1:
                pulseFinal[0].star1 = pulseFinal[0].star1 + 1;
                break;
              case 2:
                pulseFinal[0].star2 = pulseFinal[0].star2 + 1;
                break;
              case 3:
                pulseFinal[0].star3 = pulseFinal[0].star3 + 1;
                break;
              default:
                pulseFinal[0].star0 = pulseFinal[0].star0 + 1;
            }
            break;
          case "1":
            switch (question.entry) {
              case 1:
                pulseFinal[1].star1 = pulseFinal[0].star1 + 1;
                break;
              case 2:
                pulseFinal[1].star2 = pulseFinal[0].star2 + 1;
                break;
              case 3:
                pulseFinal[1].star3 = pulseFinal[0].star3 + 1;
                break;
              default:
                pulseFinal[1].star0 = pulseFinal[0].star0 + 1;
            }
            break;
          case "2":
            switch (question.entry) {
              case 1:
                pulseFinal[2].star1 = pulseFinal[0].star1 + 1;
                break;
              case 2:
                pulseFinal[2].star2 = pulseFinal[0].star2 + 1;
                break;
              case 3:
                pulseFinal[2].star3 = pulseFinal[0].star3 + 1;
                break;
              default:
                pulseFinal[2].star0 = pulseFinal[0].star0 + 1;
            }
        }
      });
    });

    retroDataObj.pulseCheckChartData = pulseFinal;
    output.push(retroDataObj);
  });

  return output;
}

module.exports = {
  getParticipantMoodCount,
};
