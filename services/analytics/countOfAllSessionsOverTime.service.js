const db = require("../../_helpers/db");
const usersDB = db.User;

const retroDB = db.Retro;
const { ROLE_NAME } = require("../../_helpers/const");
const month = require("../../utils/getMonthRange");

async function getCountOfAllSessionsOverTime(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();
  let monthsWithinRange = month.getMonthRange(timestamp1, timestamp2);

  var aggregationPipeline = [];
  if(ROLE_NAME.ENTERPRISE_ADMIN==roleName){

    if(teamId=="0"){
        aggregationPipeline=    [
            {
              $match: {
                timestamp: {
                  $gte: timestamp1, 
                  $lte: timestamp2, 
                },
                enterpriseId:enterpriseId,
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
          ]

    }else{
        aggregationPipeline=[
            {
              $match: {
                timestamp: {
                  $gte: timestamp1, 
                  $lte: timestamp2, 
                },
                teamId:teamId,enterpriseId:enterpriseId,
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
          ]

    }
    
  }
  else {

    if(ROLE_NAME.REGULAR_ENTERPRISE==roleName){
        if(teamId=="0"){
            const user = await usersDB.find({ emailId: id });
            const teamIds = user && user[0]?user[0].team :[];

            if(teamIds==[])
            {return []}

            aggregationPipeline=[
                {
                  $match: {
                    timestamp: {
                      $gte: timestamp1, 
                      $lte: timestamp2, 
                    },
                    teamId:{ $in: teamIds },enterpriseId:enterpriseId,
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
              ]

        }else{
            aggregationPipeline=[
                {
                  $match: {
                    timestamp: {
                      $gte: timestamp1, 
                      $lte: timestamp2, 
                    },
                    teamId:teamId,enterpriseId:enterpriseId
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
              ]

        }
    }

  }

  let retroData = await retroDB.aggregate(aggregationPipeline);
  let output=[];
  monthsWithinRange.forEach((month) => {
    var retroDataObj = {
      month: month,
      retroCount: 0,
      retros: [],
    };
    retroData.forEach((retroArray) => {
      if (month == retroArray._id) {
        retroDataObj.retroCount= retroArray.data.length;
        retroDataObj.retros=retroArray.data;
      }
    });
    output.push(retroDataObj)
  });

  return output;
}

module.exports = {
    getCountOfAllSessionsOverTime,
};
