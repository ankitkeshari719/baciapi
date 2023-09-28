const db = require("../../_helpers/db");
const usersDB = db.User;

const retroDB = db.Retro;
const { ROLE_NAME, EMOTIONS_PER_CATEGORY } = require("../../_helpers/const");
const month = require("../../utils/getMonthRange");
const { resource } = require("../..");

async function getEmotionsAsPerCategory(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();

  var queryForEmotionsPerCategory = (queryForEmotionsPerCategory = {
    enterpriseId: enterpriseId,
    createdAt: { $gte: timestamp1, $lte: timestamp2 },
  });

  if (teamId == "0") {
    if (ROLE_NAME.ENTERPRISE_ADMIN == roleName)
      queryForEmotionsPerCategory = {
        enterpriseId: enterpriseId,
        timestamp: { $gte: timestamp1, $lte: timestamp2 },
      };
    else if (ROLE_NAME.REGULAR_ENTERPRISE == roleName) {
      const user = await usersDB.find({ emailId: id });
      const teamIds = user && user[0] ? user[0].teams : [];
      if (teamIds == []) {
        return [];
      }
      queryForEmotionsPerCategory = {
        enterpriseId: enterpriseId,
        timestamp: { $gte: timestamp1, $lte: timestamp2 },
        teamId: { $in: teamIds },
      };
    }
  } else if (teamId != "0") {
    queryForEmotionsPerCategory = {
      enterpriseId: enterpriseId,
      timestamp: { $gte: timestamp1, $lte: timestamp2 },
      teamId: teamId,
    };
  }

  let retroList = await retroDB.find(queryForEmotionsPerCategory, {
    _id: 1,
    emotionsAsPerCategory: 1,
  });

  //   console.log(typeof(retroList),retroList[0]);

  var emotions = EMOTIONS_PER_CATEGORY;
  console.log(retroList,"retroList")
if(retroList.length>0)
 { retroList.forEach((element) => {
    element.emotionsAsPerCategory.forEach((group) => {
      emotions.forEach((emotion) => {
        if (emotion.groupName == group.groupName)
          emotion.happyCardsLength = emotion.happyCardsLength
            ? emotion.happyCardsLength
            : 0 + group.happyCards.length;
        emotion.sadCardsLength = emotion.sadCardsLength
          ? emotion.sadCardsLength
          : 0 + group.sadCards.length;
        emotion.neutralCardsLength = emotion.neutralCardsLength
          ? emotion.neutralCardsLength
          : 0 + group.neutralCards.length;
      });
    });
  });}
  else{
    emotions.forEach((emotion) => {
      emotion.happyCardsLength=0;
      emotion.sadCardsLength=0;
      emotion.neutralCardsLength=0;

    })
  }

  return emotions;
}

module.exports = {
  getEmotionsAsPerCategory,
};
