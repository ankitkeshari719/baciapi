const db = require("../../_helpers/db");
const usersDB = db.User;

const retroDB = db.Retro;
const { ROLE_NAME,RETRO_STATUS } = require("../../_helpers/const");
const month = require("../../utils/getMonthRange");
const { Configuration, OpenAIApi } = require("azure-openai");

async function getOverAllSummary(req) {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();

  const openai = new OpenAIApi(
    new Configuration({
      apiKey: this.apiKey,
      azure: {
        apiKey: process.env.OPENAI_API_KEY,
        endpoint: process.env.OPENAI_API_BASE,
      
      },
    })
  );
  var queryForRetroSummary = {
    enterpriseId: enterpriseId,
    timestamp: {
      $gte: timestamp1,
      $lte: timestamp2,
    },
  };
  if (teamId == "0") {
    if (ROLE_NAME.ENTERPRISE_ADMIN == roleName) {
      queryForRetroSummary = {
        enterpriseId: enterpriseId,
        timestamp: {
          $gte: timestamp1,
          $lte: timestamp2,
        },
        retroStatus:RETRO_STATUS.ENDED
      };
    } else if (ROLE_NAME.REGULAR_ENTERPRISE == roleName) {
      const user = await usersDB.find({ emailId: id });
      const teamIds = user && user[0] ? user[0].teams : [];

      queryForRetroSummary = {
        enterpriseId: enterpriseId,
        timestamp: {
          $gte: timestamp1,
          $lte: timestamp2,
        },
        teamId: { $in: teamIds },
        retroStatus:RETRO_STATUS.ENDED
      };
    }
  } else {
    queryForRetroSummary = {
      enterpriseId: enterpriseId,
      timestamp: {
        $gte: timestamp1,
        $lte: timestamp2,
      },
      teamId: teamId,
      retroStatus:RETRO_STATUS.ENDED
    };
  }

  const retroSummaryArray = await retroDB.find(queryForRetroSummary, {
    retroSummary: 1,
  });
  var retroSummaryString = "";
  retroSummaryArray.forEach((element, index) => {
    if (index < 40) {
      retroSummaryString = element.retroSummary;
    }
  });

  const stringForRetroSummary = `Please write the retros summary in your way using below data and the summary should be of more than 1000 characters
${retroSummaryString}`;
if(retroSummaryArray.length!=0)
  {const completion = await openai.createChatCompletion({
    model: "prod-baci-chat",
    messages: [{ role: "user", content: stringForRetroSummary }],
  });

  const stringForKeywordExtraction=`Please extract the keywords from the text return an array of keywords in json. example ["keyword1","keyword2",...],${completion.data.choices[0].message.content}. `
  const keywords = await openai.createChatCompletion({
    model: "prod-baci-chat",
    messages: [{ role: "user", content: stringForKeywordExtraction }],
  });
  
  
  return {summary:completion.data.choices[0].message.content,keywords:JSON.parse(keywords.data.choices[0].message.content)};
  }
else return ""
}

module.exports = {
  getOverAllSummary,
};
