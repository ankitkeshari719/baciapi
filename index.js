const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const config = require("./config.json");
require("dotenv").config();
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const { MongoClient, ObjectId, Logger } = require("mongodb");
const http = require("http");
const { io } = require("./utils/socket");
const { Socket } = require("./utils/socket");
const moment = require("moment");
var momentTimeZone = require("moment-timezone");
const nodeCron = require("node-cron");
const cors = require("cors");
const month = require("./utils/getMonthRange");
const BearerStrategy = require("passport-azure-ad").BearerStrategy;
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
const axios = require("axios");
const urlApi = require("url");
const db = client.db(`bacidb`);
const collection = db.collection("retros");
const teamsDB = db.collection("teams");
const usersDB = db.collection("users");
const actionsDB = db.collection("actions");
const {
  ROLE_NAME,
  RETRO_STATUS,
  EMOTIONS_PER_CATEGORY,
} = require("./_helpers/const");
// const ACE = require('atlassian-connect-express');


//openAI
const { Configuration, OpenAIApi } = require("azure-openai");

// Importing dummy JSON Data for all analytics
const {
  teamLevelActionCounts,
  allTeamsEnterpriseActionsResult,
  mobileTeamEnterpriseActionsResult,
  superannuationTeamEnterpriseActionsResult,
  insuranceTeamEnterpriseActionsResult,
  allTeamsParticipantResult,
  mobileTeamParticipantResult,
  superannuationTeamParticipantResult,
  insuranceTeamParticipantResult,
  allTeamsSessionResult,
  mobileTeamSessionResult,
  superannuationTeamSessionResult,
  insuranceTeamSessionResult,
  allTeamsSummaryResult,
  mobileTeamSummaryResult,
  superannuationTeamSummaryResult,
  insuranceTeamSummaryResult,
  allTeamsThemeResult,
  mobileTeamsThemeResult,
  superannuationTeamThemeResult,
  insuranceTeamThemeResult,
  allTeamsMoodResult,
  mobileTeamMoodResult,
  superannuationTeamMoodResult,
  insuranceTeamMoodResult,
} = require("./_helpers/analyticsConst");













// const { inputLayer } = require("@tensorflow/tfjs-layers/dist/exports_layers");

const openai = new OpenAIApi(
  new Configuration({
    apiKey: this.apiKey,
    azure: {
      apiKey: process.env.OPENAI_API_KEY,
      endpoint: process.env.OPENAI_API_BASE,
      //apiVersion: "2023-03-15-preview",
      //apiType: "azure",
    },
  })
);

const options = {
  identityMetadata: `https://${config.metadata.b2cDomain}/${config.credentials.tenantName}/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
  clientID: config.credentials.clientID,
  audience: config.credentials.clientID,
  policyName: config.policies.policyName,
  isB2C: config.settings.isB2C,
  validateIssuer: config.settings.validateIssuer,
  loggingLevel: config.settings.loggingLevel,
  passReqToCallback: config.settings.passReqToCallback,
  scope: config.protectedRoutes.hello.scopes,
};

const bearerStrategy = new BearerStrategy(options, (token, done) => {
  // Send user info using the second argument
  done(null, {}, token);
});

app.use(morgan("dev"));

app.use(passport.initialize());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded());

passport.use(bearerStrategy);

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

const server = http.createServer(app);

io.attach(server);
app.use(cors());
//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// exposed API endpoint
app.get(
  "/hello",
  passport.authenticate("oauth-bearer", { session: false }),
  (req, res) => {
    console.log("Validated claims: ", req.authInfo);

    // Service relies on the name claim.
    res.status(200).json({
      name: req.authInfo["name"],
      "issued-by": req.authInfo["iss"],
      "issued-for": req.authInfo["aud"],
      scope: req.authInfo["scp"],
    });
  }
);




















// Api routes
app.use("/users", require("./controllers/user.controller"));
app.use("/roles", require("./controllers/role.controller"));
app.use("/teams", require("./controllers/team.controller"));
app.use("/enterprises", require("./controllers/enterprise.controller"));
app.use("/actions", require("./controllers/action.controller"));
app.use("/notifications", require("./controllers/notification.controller"));
app.use(
  "/enterpriseRequests",
  require("./controllers/enterprise.request.controller")
);
app.use("/analytics", require("./controllers/analytics.controller"));

// Retro API's
app.post("/createRetro", async (req, res) => {
  let retro = req.body.retro;
  let creator = req.body.creator;
  console.log("serverTimestamp", Date.now());

  const requestData = {
    name: req.body.retro.name,
    humanId: req.body.retro.humanId,
    joinUrl: req.body.retro.joinUrl,
    retroGoal: req.body.retro.retroGoal,
    retroTimeframe: req.body.retro.retroTimeframe,
    selectedTemplate: req.body.retro.selectedTemplate,
    selectedPulseCheck: req.body.retro.selectedPulseCheck,
    userName: req.body.retro.userName,
    selectedAvatar: req.body.retro.selectedAvatar,
    userType: req.body.retro.userType,
    selectedTeam: req.body.retro.selectedTeam,
    scheduleRetroType: req.body.retro.scheduleRetroType,
    scheduleRetroTime: req.body.retro.scheduleRetroTime,
    scheduleDescription: req.body.retro.scheduleDescription,
    isLoginUser: req.body.retro.isLoginUser,
    retroSummary: req.body.retro.retroSummary,
    enterpriseId: req.body.retro.enterpriseId,
    action: req.body.retro.action,
    creatorId: creator.id,
    timestamp: Date.now(),
    retroStatus: "waiting",
    waitingTimestamp: Date.now(),
    retroDate: req.body.retroDate ? req.body.retroDate : Date.now(),
    isActive: true,
  };
  const result = await collection.insertOne(requestData);
  return res.status(200).json({ id: result.insertedId });
});

app.post("/addRetroAction", async (req, res) => {
  let retroId = req.body.retroId;
  let action = req.body.action;
  const query = { _id: retroId };
  const update = {
    $push: {
      action: {
        ...action,
        timestamp: Date.now(),
        sourceActionTimestamp: action.sourceActionTimestamp,
        //sourceActionTimestamp: Date.now(),
      },
    },
  };
  const options = { upsert: true };
  console.log("action", action);
  if (action.actionName == "endRetro") {
    const filter = { _id: retroId };
    const update = {
      $set: { retroStatus: RETRO_STATUS.ENDED },
    };
    await collection.updateOne(filter, update);
  } else if (action.actionName == "startRetro") {
    const filter = { _id: retroId };
    const update = {
      $set: { retroStatus: RETRO_STATUS.STARTED },
    };
    await collection.updateOne(filter, update);
  }
  const result = await collection.findOneAndUpdate(query, update);
  action.timestamp = Date.now();
  console.log(`upsertResult1: ${JSON.stringify(result.value?._id)}\n`);
  Socket.emit("newMessage", retroId, [
    {
      action: action,
      retroId: retroId,
    },
  ]);
  return res.status(200).json({ id: result.value?._id });
});

app.get("/getRetro", async (req, res) => {
  let id = req.query.id;
  const result = await collection.find({ _id: ObjectId(id) }).toArray();
  console.log(result);
  return res.status(200).json({ retro: result });
});

app.get("/getRetroByHumanId", async (req, res) => {
  let id = req.query.id;
  const result = await collection.find({ humanId: id }).toArray();
  console.log(result);
  return res.status(200).json({ retro: result });
});

app.get("/getRetroActions", async (req, res) => {
  let id = req.query.id;
  let userId = req.query.userId;
  let fromTimestamp = req.query.fromTimestamp;
  let ts = fromTimestamp === undefined ? 0 : parseInt(fromTimestamp);
  console.log(ts);
  const result = await collection
    .find({
      $and: [
        {
          _id: ObjectId(id),
        },
        {
          "action.sourceActionTimestamp": { $gt: ts },
        },
      ],
    })
    .project({
      _id: 0,
      action: 1,
    })
    .toArray();
  console.log(result);
  return res.status(200).json({ retro: result });
});

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function sumArray(array) {
  const ourArray = array;
  let sum = 0;

  for (let i = 0; i < ourArray.length; i += 1) {
    sum += ourArray[i];
  }

  return sum;
}
app.get("/getRetrosByDate", async (req, res) => {
  console.log(req.query, "  ", req.query.startDate, "   -", req.query.endDate);
  let timestamp1 = new Date(req.query.startDate).getTime();
  let timestamp2 = new Date(req.query.endDate).getTime();
  const result = await collection
    .find({
      waitingTimestamp: { $gte: timestamp1, $lte: timestamp2 },
      //   "waitingTimestamp": { $lte: timestamp2 },
    })
    .toArray();
  console.log(result.length, timestamp1, "<>", timestamp2);
  const totalGroups = [];
  const totalCardGroups = [];
  const totalUsers = [];
  const totalUsersCount = [];
  const usersStringArray = [];
  var count = 0;

  result.length > 0 &&
    result.forEach((retro) => {
      const groups = [];
      const users = [];

      retro.action
        ? retro.action.forEach((element) => {
            if (
              element.actionName == "mergeCards" ||
              element.actionName == "createGroup"
            ) {
              console.log(count, "count");
              count = count + 1;
              groups.push(element);
            } else if (element.actionName == "deleteGroup") {
              console.log("deleteGroup");
              groups.length > 0 &&
                groups.forEach(function (group, index, object) {
                  if (group.parameters.groupId == element.parameters.groupId) {
                    object.splice(index, 1);
                    count = count - 1;
                  }
                });
            } else if (element.actionName == "joinRetro") {
              users.push(element);
              if (element.userId != "") usersStringArray.push(element.userId);
            }
          })
        : [];

      totalGroups.push(groups.length);
      totalCardGroups.push(groups);
      totalUsers.push(users, users.length);
      totalUsersCount.push(users.length);
    });
  const uniqueUsers = usersStringArray.filter(onlyUnique);
  return res.status(200).json({
    totalRetros: result.length,
    uniqueUserCount: uniqueUsers.length,
    avgUserCountPerRetro: sumArray(totalUsersCount) / result.length,
    countOfUsers: sumArray(totalUsersCount),
    avgGroupCount: sumArray(totalGroups) / result.length,
    usersStringArray: uniqueUsers,
    groupCountPerRetro: totalGroups,
    count: count,
    totalUsersCountPerRetro: totalUsersCount,
    // totalUsers: totalUsers,
    // totalCardGroups: totalCardGroups,
  });
});

// Function to delete the Retro
const deleteOlderRetro = async (retro_id) => {
  const retro = await db.collection("retros").deleteOne({ _id: retro_id });
  console.log("Deleted retro:: ", retro);
};

// Function to get all the retro data and evaluate the old time duration
const getRetrosData = async () => {
  const currentDate = moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
  const retros = await db.collection("retros").find().toArray();
  retros.forEach((e) => {
    const retroCreatedTime = moment
      .unix(e.timestamp / 1000)
      .format("DD/MM/YYYY HH:mm:ss");
    const ms = moment(currentDate, "DD/MM/YYYY HH:mm:ss").diff(
      moment(retroCreatedTime, "DD/MM/YYYY HH:mm:ss")
    );
    const duration = moment.duration(ms);
    const timeElapsed = Math.floor(duration.asDays());
    if (timeElapsed > 90) {
      // deleteOlderRetro(e._id);
    }
  });
};

//------------------------------------------- Add Feedback API's-------------------------------------------
app.post("/addFeedback", async (req, res) => {
  let retroId = req.body.retroId;
  let user = req.body.user;
  let rating = req.body.rating;
  let comment = req.body.comment;

  console.log("serverTimestamp", Date.now());
  const result = await db.collection("feedback").insertOne({
    retroId,
    userId: user.id,
    rating,
    comment,
    timestamp: Date.now(),
  });
  return res.status(200).json({ id: result.insertedId });
});

// Api to add the deployment and  notification Date
app.post("/addDeploymentData", async (req, res) => {
  let deploymentDate = req.body.deploymentDate;
  let notificationDate = req.body.notificationDate;
  let checkedDeploymentDate = new Date(deploymentDate);
  let checkedNotificationDate = new Date(notificationDate);
  if (checkedNotificationDate > checkedDeploymentDate) {
    return res.status(200).json({
      message: "Notification Date should be lesser then Deployment Date!",
    });
  }

  var timezone = momentTimeZone.tz.guess();

  const isActive = 1;
  const isDeployed = 0;
  const modifiedDeploymentDate = moment(checkedDeploymentDate).format(
    "YYYY-MM-DDThh:mm:ss.SSSZ"
  );
  const modifiedNotificationDate = moment(checkedNotificationDate).format(
    "YYYY-MM-DDT00:00:00.SSSZ"
  );

  await db.collection("deployment").updateMany({}, { $set: { isActive: 0 } });
  await db.collection("deployment").updateMany({}, { $set: { isDeployed: 1 } });

  const result = await db.collection("deployment").insertOne({
    deploymentDate: modifiedDeploymentDate,
    notificationDate: modifiedNotificationDate,
    isActive,
    isDeployed,
    timestamp: Date.now(),
  });
  return res
    .status(200)
    .json({ id: result.insertedId, message: "Data inserted successfully!" });
});

// Api to get the entry of deployment and  notification Date which is active
app.get("/getDeploymentData", async (req, res) => {
  const result = await db
    .collection("deployment")
    .find({ isActive: 1 })
    .toArray();
  return res.status(200).json({ result: result });
});

// ------------------------------------------- This cron-job will run at 00:30:00am-------------------------------------------
const job = nodeCron.schedule("0 30 0 * * *", function jobYouNeedToExecute() {
  getRetrosData();
});

//------------------------------- openAi -------------------------------------------
app.post("/keywordExtraction", async (req, res) => {
  try {
    const data = [];

    var inputColumn = req.body.column;

    inputColumn.forEach((element) => {
      data.push(element.value);
    });

    const jsonString1 = JSON.stringify(data, null, 2);

    // const jsonString1 = JSON.stringify(whatWentWell, null, 2);

    const combinedString1 = `Please extract the main keywords from the sentences \n\n${jsonString1}. Maximum keywords per sentences are 3. Return it in the form of array

    The responce must be like [{sentence:'',keywords:[]},{sentence:'',keywords:[]}].Convert the response into json

    `;

    const completion = await openai.createChatCompletion({
      model: "prod-baci-chat",

      messages: [{ role: "user", content: combinedString1 }],
    });

    const resArray = JSON.parse(completion.data.choices[0].message.content);

    let keywordResponse = [];

    if (resArray && resArray.length > 0) {
      inputColumn.forEach((input) => {
        resArray.forEach((element) => {
          if (element.sentence.toLowerCase() == input.value.toLowerCase()) {
            // var card = input;

            input.keywords = element.keywords;
          }
        });
      });
    }

    console.log(completion.data.choices[0].message.content, "res", inputColumn);

    return res.status(200).json({ response: inputColumn });
  } catch (error) {
    console.log(error, "error");

    return res.status(200).json(error);
  }
});

async function getAiResponse(topic) {
  const openai = new OpenAIApi(configuration);
  await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: topic,
      max_tokens: 1024,
      n: 1,
      stop: null,
      temperature: 0.7,
    })
    .then((res) => {
      return res;
      console.log(res.data.choices[0].text, "log here");
    });

  return completion;
}

app.post("/createRetroSummary", async (req, res) => {
  try {
    const column = JSON.stringify(req.body.columns, null, 2);
    const cards = req.body.cards;
    const retroId = req.body.retroId;
    const stringForRetroSummary = `Please extract the summary from retro data
  \n\n${column}
  `;
    const emotionsPerCategory = JSON.stringify(EMOTIONS_PER_CATEGORY, null, 2);
    const stringForRetroEmotionsSummary = `Please count the number of happy, sad, and neutral cards in the following list:${cards}. 
  The output should be in json and the keys should be in camelCase notation example {happyCards:happycount, sadCards:sadcount, neutralCards: neutralCount}`;

    const stringForRetroEmotionsSummaryAsPerCategory = `categories below cards as per group name and push them depending on emotions also return it in the form of JSON  ${emotionsPerCategory},
     the cards are :${cards}, dont't include any note or other thing it should be only json of array, we have to push cards in one of group mentioned above`;

    console.log(stringForRetroEmotionsSummaryAsPerCategory, "string");

    const completion = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [{ role: "user", content: stringForRetroSummary }],
    });

    const filter = { _id: retroId };
    const update = {
      $set: { retroSummary: completion.data.choices[0].message.content },
    };

    const emotions = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [{ role: "user", content: stringForRetroEmotionsSummary }],
    });
    const updateEmotions = {
      $set: {
        retroEmotions: JSON.parse(emotions.data.choices[0].message.content),
      },
    };

    const emotionsAsPerCategoryC = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [
        { role: "user", content: stringForRetroEmotionsSummaryAsPerCategory },
      ],
    });

    console.log(emotionsAsPerCategoryC.data.choices[0].message.content);

    const updateEmotionsAsPerCategory = {
      $set: {
        emotionsAsPerCategory: JSON.parse(
          emotionsAsPerCategoryC.data.choices[0].message.content
        ),
      },
    };

    await collection.updateOne(filter, update);
    await collection.updateOne(filter, updateEmotions);
    await collection.updateOne(filter, updateEmotionsAsPerCategory);

    return res.status(200).json({
      retroSummary: completion.data.choices[0].message.content,
      retroEmotions: JSON.parse(emotions.data.choices[0].message.content),
      emotionsAsPerCategory: JSON.parse(
        emotionsAsPerCategoryC.data.choices[0].message.content
      ),
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json(error);
  }
});

app.post("/groupSuggestion", async (req, res) => {
  try {
    const data = [];
    let inputColumn = req.body.column;
    inputColumn.forEach((element) => {
      data.push(element.value);
    });
    const jsonString = JSON.stringify(data, null, 2);

    const groupSuggestionString = `Please help me group these sentences into categories and give each category a name, dont use sentiment analysis for grouping.The group count should be less then 6, maximum 2 group should contain only one card. Then convert the response to json array.
    If you could not process or error then please provide with baciError300 only don't add other data. The sentences are present in array \n\n${jsonString}. Please don't consider if the sentences array is empty while returning drop that object,All categories should not contain one card each,one category can have one card.The responst must be like [{category:"xyz",sentences["one","other"]}]`;

    const completion = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [{ role: "user", content: groupSuggestionString }],
    });

    if (
      !completion.data.choices[0].message.content.includes("baciError300") &&
      JSON.parse(completion.data.choices[0].message.content)
    ) {
      const responseData = JSON.parse(
        completion.data.choices[0].message.content
      );
      const structuredData = [];
      responseData.forEach((element) => {
        const sentences = [];
        element.sentences.forEach((sentence) => {
          inputColumn.forEach((inputData) => {
            if (inputData.value.toLowerCase() == sentence.toLowerCase()) {
              sentences.push(inputData);
            }
          });
        });

        structuredData.push({
          groupName: element.category,
          cards: sentences,
        });
      });

      return res.status(200).json({ response: structuredData });
    } else
      return res
        .status(200)
        .json({ response: "ChatGPT Fails, Please try again" });
  } catch (error) {
    console.error("chatGPTError", error);
    return res.status(200).json(error);
  }
});

//------------------------------- Jira integration Changes -------------------------------
app.get("/connectJira", async (req, res) => {
  let retroId = req.query.retroId;
  console.log("in connect jira");
  let url = process.env.JIRA_URL + `&state=${retroId}`;
  console.log(url);
  return res.status(200).json({ response: url });
});

app.get("/getJiraToken", async (req, res) => {
  let jiraCode = req.query.jiraCode;
  console.log("in connect jira");
  let access_token = "";
  const api = axios.create({
    baseURL: `https://auth.atlassian.com/oauth/token`,
  });
  await api
    .post(
      "",
      new urlApi.URLSearchParams({
        grant_type: "authorization_code", //gave the values directly for testing
        client_id: process.env.JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
        code: jiraCode,
        redirect_uri: process.env.JIRA_CALLBACK_URl,
      })
    )
    .then(async (response) => {
      console.log(response.data.access_token);
      access_token = response.data.access_token;
      return res.status(200).json({ response: access_token });
    })
    .catch((error) => {
      console.log("Error", error);
    });
});













app.get("/listJiraProjects", async (req, res) => {
  let access_token = req.query.jiraCode;
  let cloudId = "";
  let listOfProjects = [];
  let config = {
    headers: {
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  await axios
    .get("https://api.atlassian.com/oauth/token/accessible-resources", config)
    .then(async (response) => {
      console.log("cloud id", response.data[0].id);
      cloudId = response.data[0].id;
      await axios
        .get(
          "https://api.atlassian.com/ex/jira/" +
            cloudId +
            "/rest/api/2/project",
          config
        )
        .then((response) => {
          console.log("list of projects", response.data);
          let projects = response.data;
          projects.forEach((project) => {
            listOfProjects.push({ id: project.id, name: project.name });
          });
          return res.status(200).json({ response: listOfProjects });
        });
    })
    .catch((err) => {
      console.log("This is the error", err);
    });
});

app.get("/listJiraMeta", async (req, res) => {
  let access_token = req.query.jiraCode;
  let projectId = req.query.projectId;
  let cloudId = "";
  let listOfProjects = [];
  let config = {
    headers: {
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };
  await axios
    .get("https://api.atlassian.com/oauth/token/accessible-resources", config)
    .then(async (response) => {
      console.log("cloud id", response.data[0].id);
      cloudId = response.data[0].id;
      await axios
        .get(
          "https://api.atlassian.com/ex/jira/" +
            cloudId +
            `/rest/api/2/issue/createmeta?projectIds=${projectId}`,
          config
        )
        .then((response) => {
          console.log("list of metadata", response.data);
          let projects = response.data.projects[0].issuetypes;
          projects.forEach((project) => {
            listOfProjects.push({ id: project.id, name: project.name });
          });
          return res.status(200).json({ response: listOfProjects });
        });
    })
    .catch((err) => {
      console.log("This is the error", err);
    });
});


//------------ list the jira users ------------------//

app.post("/getJiraUsers", async (req, res) => {
  // let projectId = req.body.projectId;
  // let issueType = req.body.issueType;
  let access_token = req.body.access_token;
  // let description = req.body.description;
  let cloudId = "";
  let assignee = "";
  let config = {
    headers: {
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };

  // await axios
  //   .get("https://api.atlassian.com/me", config)
  //   .then(async (response) => {
  //     console.log(response);
  //     assignee = response.data.account_id;
  //   })
  //   .catch((err) => {
  //     console.log("This is the error", JSON.stringify(err.response.data));
  //   });

  // const payload = {
  //   fields: {
  //     assignee: {
  //       id: assignee,
  //     },
  //     project: {
  //       id: projectId,
  //     },
  //     issuetype: {
  //       id: issueType,
  //     },
  //     summary: "BACI - TEST",
  //     description: description,
  //   },
  //   update: {},
  // };
  await axios
    .get("https://api.atlassian.com/oauth/token/accessible-resources", config)
    .then(async (response) => {
      console.log("cloud id", response.data[0]);
      cloudId = response.data[0].id;
      await axios
        .get(
          "https://api.atlassian.com/ex/jira/" + cloudId + `/rest/api/2/users/search`,
          config
        )
        .then((response) => {
          console.log("getJiraUsers",response.message);
          if (response.status === 200) {
            return res.status(200).json({ response: "Success",data:response.data });
          } else return res.status(400).json({ response: "Error" });
        });
    })
    .catch((err) => {
      console.log(
        "This is the error",
        JSON.stringify(err.response.data)
      );
    });
});




app.post("/createJiraIssue", async (req, res) => {
  let projectId = req.body.projectId;
  let issueType = req.body.issueType;
  let access_token = req.body.access_token;
  let description = req.body.description;
  let cloudId = "";
  let assignee = "";
  let config = {
    headers: {
      Authorization: "Bearer " + access_token,
      Accept: "application/json",
    },
  };

  await axios
    .get("https://api.atlassian.com/me", config)
    .then(async (response) => {
      console.log(response);
      assignee = response.data.account_id;
    })
    .catch((err) => {
      console.log("This is the error", JSON.stringify(err.response.data));
    });

  const payload = {
    fields: {
      assignee: {
        id: assignee,
      },
      project: {
        id: projectId,
      },
      issuetype: {
        id: issueType,
      },
      summary: "BACI - TEST",
      description: description,
    },
    update: {},
  };
  await axios
    .get("https://api.atlassian.com/oauth/token/accessible-resources", config)
    .then(async (response) => {
      console.log("cloud id", response.data[0]);
      cloudId = response.data[0].id;
      await axios
        .post(
          "https://api.atlassian.com/ex/jira/" + cloudId + `/rest/api/2/issue`,
          payload,
          config
        )
        .then((response) => {
          console.log(response.data.errors);
          if (response.status === 201) {
            return res.status(200).json({ response: "Success" });
          } else return res.status(400).json({ response: "Error" });
        });
    })
    .catch((err) => {
      console.log(
        "This is the error",
        JSON.stringify(err.response.data.errors)
      );
    });
});

// ------------------------------- Analytics API's ----------------------------------------------
// Api to get dummy chart data
app.post("/getSessionsData", async (req, res) => {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();

  //Get the team list

  if (teamId == "0" && roleName == roleName.ENTERPRISE_ADMIN) {
    const retroSessions = await collection
      .find({
        enterpriseId: enterpriseId,
        timestamp: { $gte: timestamp1, $lte: timestamp2 },
      })
      .toArray();
    return res.status(200).json({ result: retroSessions });
  } else if (teamId != "0" && roleName == roleName.ENTERPRISE_ADMIN) {
    const retroSessions = await collection
      .find({
        enterpriseId: enterpriseId,
        timestamp: { $gte: timestamp1, $lte: timestamp2 },
        teamId: teamId,
      })
      .toArray();
    return res.status(200).json({ result: retroSessions });
  } else {
    let retroSession = [];
    const user = await usersDB.find({ emailId: id }).toArray();
    const teamIds = user && user[0].teams;

    if (teamIds?.length > 0) {
      for (var i = 0; i < teamIds.length; i++) {
        let team = teamIds[i];
        let sessions = await collection
          .find({
            enterpriseId: enterpriseId,
            timestamp: { $gte: timestamp1, $lte: timestamp2 },
            teamId: team,
          })
          .toArray();

        sessions.forEach((retro) => {
          retroSession.push(retro);
        });
      }
      return res.status(200).json({ result: retroSession });
    } else return res.status(200).json({ result: [] });
  }
});

app.post("/getActionsChartData", async (req, res) => {
  const id = req.body.userId;
  const roleName = req.body.roleName;
  const enterpriseId = req.body.enterpriseId;
  const teamId = req.body.teamId;
  let timestamp1 = new Date(req.body.fromDate).getTime();
  let timestamp2 = new Date(req.body.toDate).getTime();
  let monthsWithinRange = month.getMonthRange(timestamp1, timestamp2);
  var finalData = [];

  monthsWithinRange.forEach((element) => {
    const jiraChartObject = {
      month: element,
      pending: 0,
      completed: 0,
      completedInPer: 0,
    };
    finalData.push(jiraChartObject);
  });

  if (teamId == "0" && roleName == ROLE_NAME.ENTERPRISE_ADMIN) {
    const j = await actionsDB
      .find({
        enterpriseId: enterpriseId,
        createdAt: { $gte: timestamp1, $lte: timestamp2 },
      })
      .toArray();

    var result = j.reduce((acc, elem) => {
      isPresent = acc.findIndex((k) => k.actionId == elem.actionId);
      if (isPresent == -1) {
        acc.push(elem);
      } else {
        if (new Date(acc[isPresent].updatedAt) < new Date(elem.updatedAt))
          acc[isPresent] = elem;
      }
      return acc;
    }, []);

    return res.status(200).json({
      chartData: month.parseActionDataForChart(finalData, result),
      actionsData: result,
    });
  } else if (
    teamId != "0" &&
    (roleName == ROLE_NAME.ENTERPRISE_ADMIN ||
      roleName == ROLE_NAME.REGULAR_ENTERPRISE)
  ) {
    var query = {
      enterpriseId: enterpriseId,
      createdAt: { $gte: timestamp1, $lte: timestamp2 },
      teamId: teamId,
    };
    if (roleName == ROLE_NAME.ENTERPRISE_ADMIN) {
      query = {
        enterpriseId: enterpriseId,
        createdAt: { $gte: timestamp1, $lte: timestamp2 },
        teamId: teamId,
      };
    } else {
      query = {
        enterpriseId: enterpriseId,
        createdAt: { $gte: timestamp1, $lte: timestamp2 },
        teamId: teamId,
        assignedTo: id,
      };
    }
    const j = await actionsDB.find(query).toArray();
    var result = j.reduce((acc, elem) => {
      isPresent = acc.findIndex((k) => k.actionId == elem.actionId);
      if (isPresent == -1) {
        acc.push(elem);
      } else {
        if (new Date(acc[isPresent].updatedAt) < new Date(elem.updatedAt))
          acc[isPresent] = elem;
      }
      return acc;
    }, []);
    return res.status(200).json({
      chartData: month.parseActionDataForChart(finalData, result),
      actionsData: result,
    });
  } else if (teamId == "0" && roleName == ROLE_NAME.REGULAR_ENTERPRISE) {
    const user = await usersDB.find({ emailId: id }).toArray();

    const teamIds = user && user[0].teams;

    const query = {
      enterpriseId: enterpriseId,
      createdAt: { $gte: timestamp1, $lte: timestamp2 },
      teamId: { $in: teamIds },
    };
    const j = await actionsDB.find(query).toArray();
    var result = j.reduce((acc, elem) => {
      isPresent = acc.findIndex((k) => k.actionId == elem.actionId);
      if (isPresent == -1) {
        acc.push(elem);
      } else {
        if (new Date(acc[isPresent].updatedAt) < new Date(elem.updatedAt))
          acc[isPresent] = elem;
      }
      return acc;
    }, []);
    return res.status(200).json({
      chartData: month.parseActionDataForChart(finalData, result),
      actionsData: result,
    });
  } else {
    const query = {
      enterpriseId: enterpriseId,
      createdAt: { $gte: timestamp1, $lte: timestamp2 },
      assignedTo: id,
    };
    const j = await actionsDB.find(query).toArray();
    var result = j.reduce((acc, elem) => {
      isPresent = acc.findIndex((k) => k.actionId == elem.actionId);
      if (isPresent == -1) {
        acc.push(elem);
      } else {
        if (new Date(acc[isPresent].updatedAt) < new Date(elem.updatedAt))
          acc[isPresent] = elem;
      }
      return acc;
    }, []);
    return res.status(200).json({
      chartData: month.parseActionDataForChart(finalData, result),
      actionsData: result,
    });
  }
});

// Chart 1:  Api to get Team Level Actions Count

app.get("getTeamLevelActionsCountsData", async (req, res) => {
  let timestamp1 = new Date("01/01/2023").getTime();
  let timestamp2 = new Date("01/01/2024").getTime();
  console.log(timestamp1, timestamp2);
  return res.status(200).json({ result: [] });
});

app.get("/getTeamLevelActionsCounts", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;

  for (let i = 0; i < teamLevelActionCounts.length; i++) {
    if (
      teamLevelActionCounts[i].id >= fromDate &&
      teamLevelActionCounts[i].id <= toDate
    ) {
      finalResult.push(teamLevelActionCounts[i]);
    }
  }
  return res.status(200).json({ result: finalResult });
});

// Chart 2: Api to get Enterprise Level ActionsCount
app.get("/getEnterpriseLevelActionsCounts", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let team = req.query.team;

  switch (team) {
    case "0":
      for (let i = 0; i < allTeamsEnterpriseActionsResult.length; i++) {
        if (
          allTeamsEnterpriseActionsResult[i].id >= fromDate &&
          allTeamsEnterpriseActionsResult[i].id <= toDate
        ) {
          finalResult.push(allTeamsEnterpriseActionsResult[i]);
        }
      }
      break;
    case "1":
      for (let i = 0; i < mobileTeamEnterpriseActionsResult.length; i++) {
        if (
          mobileTeamEnterpriseActionsResult[i].id >= fromDate &&
          mobileTeamEnterpriseActionsResult[i].id <= toDate
        ) {
          finalResult.push(mobileTeamEnterpriseActionsResult[i]);
        }
      }
      break;
    case "2":
      for (
        let i = 0;
        i < superannuationTeamEnterpriseActionsResult.length;
        i++
      ) {
        if (
          superannuationTeamEnterpriseActionsResult[i].id >= fromDate &&
          superannuationTeamEnterpriseActionsResult[i].id <= toDate
        ) {
          finalResult.push(superannuationTeamEnterpriseActionsResult[i]);
        }
      }
      break;
    case "3":
      for (let i = 0; i < insuranceTeamEnterpriseActionsResult.length; i++) {
        if (
          insuranceTeamEnterpriseActionsResult[i].id >= fromDate &&
          insuranceTeamEnterpriseActionsResult[i].id <= toDate
        ) {
          finalResult.push(insuranceTeamEnterpriseActionsResult[i]);
        }
      }
      break;

    default:
      break;
  }

  return res.status(200).json({ result: finalResult });
});

// Chart 3: Api to get count of all participant over time
app.get("/getParticipantsCount", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let team = req.query.team;

  switch (team) {
    case "0":
      for (let i = 0; i < allTeamsParticipantResult.length; i++) {
        if (
          allTeamsParticipantResult[i].id >= fromDate &&
          allTeamsParticipantResult[i].id <= toDate
        ) {
          finalResult.push(allTeamsParticipantResult[i]);
        }
      }
      break;
    case "1":
      for (let i = 0; i < mobileTeamParticipantResult.length; i++) {
        if (
          mobileTeamParticipantResult[i].id >= fromDate &&
          mobileTeamParticipantResult[i].id <= toDate
        ) {
          finalResult.push(mobileTeamParticipantResult[i]);
        }
      }
      break;
    case "2":
      for (let i = 0; i < superannuationTeamParticipantResult.length; i++) {
        if (
          superannuationTeamParticipantResult[i].id >= fromDate &&
          superannuationTeamParticipantResult[i].id <= toDate
        ) {
          finalResult.push(superannuationTeamParticipantResult[i]);
        }
      }
      break;
    case "3":
      for (let i = 0; i < insuranceTeamParticipantResult.length; i++) {
        if (
          insuranceTeamParticipantResult[i].id >= fromDate &&
          insuranceTeamParticipantResult[i].id <= toDate
        ) {
          finalResult.push(insuranceTeamParticipantResult[i]);
        }
      }
      break;
    default:
      break;
  }
  return res.status(200).json({ result: finalResult });
});

// Chart 4:  Api to get count of all retros over time
app.get("/getRetrosCount", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let team = req.query.team;

  switch (team) {
    case "0":
      for (let i = 0; i < allTeamsSessionResult.length; i++) {
        if (
          allTeamsSessionResult[i].id >= fromDate &&
          allTeamsSessionResult[i].id <= toDate
        ) {
          finalResult.push(allTeamsSessionResult[i]);
        }
      }
      break;
    case "1":
      for (let i = 0; i < mobileTeamSessionResult.length; i++) {
        if (
          mobileTeamSessionResult[i].id >= fromDate &&
          mobileTeamSessionResult[i].id <= toDate
        ) {
          finalResult.push(mobileTeamSessionResult[i]);
        }
      }
      break;
    case "2":
      for (let i = 0; i < superannuationTeamSessionResult.length; i++) {
        if (
          superannuationTeamSessionResult[i].id >= fromDate &&
          superannuationTeamSessionResult[i].id <= toDate
        ) {
          finalResult.push(superannuationTeamSessionResult[i]);
        }
      }
      break;
    case "3":
      for (let i = 0; i < insuranceTeamSessionResult.length; i++) {
        if (
          insuranceTeamSessionResult[i].id >= fromDate &&
          insuranceTeamSessionResult[i].id <= toDate
        ) {
          finalResult.push(insuranceTeamSessionResult[i]);
        }
      }
      break;
    default:
      break;
  }

  return res.status(200).json({ result: finalResult });
});

// Chart 5: Api to get Enterprise Level ActionsCount
app.get("/getEnterpriseLevelSentimentSummary", async (req, res) => {
  let finalResult = [];
  let selectedFormat = req.query.selectedFormat;
  let team = req.query.team;

  switch (team) {
    case "0":
      for (let i = 0; i < allTeamsSummaryResult.length; i++) {
        if (allTeamsSummaryResult[i].id == selectedFormat) {
          finalResult.push(allTeamsSummaryResult[i]);
        }
      }
      break;
    case "1":
      for (let i = 0; i < mobileTeamSummaryResult.length; i++) {
        if (mobileTeamSummaryResult[i].id == selectedFormat) {
          finalResult.push(mobileTeamSummaryResult[i]);
        }
      }
      break;
    case "2":
      for (let i = 0; i < superannuationTeamSummaryResult.length; i++) {
        if (superannuationTeamSummaryResult[i].id == selectedFormat) {
          finalResult.push(superannuationTeamSummaryResult[i]);
        }
      }
      break;
    case "3":
      for (let i = 0; i < insuranceTeamSummaryResult.length; i++) {
        if (insuranceTeamSummaryResult[i].id == selectedFormat) {
          finalResult.push(insuranceTeamSummaryResult[i]);
        }
      }
      break;

    default:
      break;
  }

  return res.status(200).json({ result: finalResult });
});

// Chart 6: Api to get Enterprise Level Sentiments Moods :
app.get("/getEnterpriseLevelSentimentsTheme", async (req, res) => {
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let team = req.query.team;

  // Main Keywords
  const external_Environment = "External Environment & Conditions";
  const work_Technology = "Work Technology & Tools";
  const individual_And_Team = "Individual & Team";
  const people_And_Resources = "People & Resources";
  const structure_And_Capabilities = "Structure & Capabilities";
  const decision_Making = "Decision Making";
  const openness_to_Feedback = "Openness to Feedback";
  const work_Prioritisation = "Work Prioritisation";

  let sadResult = [];
  let neutralResult = [];
  let happyResult = [];
  let finalResult;

  // Sad Data
  let external_Environment_Sad_Value = 0;
  let work_Technology_Sad_Value = 0;
  let individual_And_Team_Sad_Value = 0;
  let people_And_Resources_Sad_Value = 0;
  let structure_And_Capabilities_Sad_Value = 0;
  let decision_Making_Sad_Value = 0;
  let openness_to_Feedback_Sad_Value = 0;
  let work_Prioritisation_Sad_Value = 0;
  // Neutral Data
  let external_Environment_Neutral_Value = 0;
  let work_Technology_Neutral_Value = 0;
  let individual_And_Team_Neutral_Value = 0;
  let people_And_Resources_Neutral_Value = 0;
  let structure_And_Capabilities_Neutral_Value = 0;
  let decision_Making_Neutral_Value = 0;
  let openness_to_Feedback_Neutral_Value = 0;
  let work_Prioritisation_Neutral_Value = 0;
  // Happy Data
  let external_Environment_Happy_Value = 0;
  let work_Technology_Happy_Value = 0;
  let individual_And_Team_Happy_Value = 0;
  let people_And_Resources_Happy_Value = 0;
  let structure_And_Capabilities_Happy_Value = 0;
  let decision_Making_Happy_Value = 0;
  let openness_to_Feedback_Happy_Value = 0;
  let work_Prioritisation_Happy_Value = 0;

  switch (team) {
    case "0":
      //  Sad Loop
      for (let i = 0; i < allTeamsThemeResult.sadData.length; i++) {
        if (
          allTeamsThemeResult.sadData[i].id >= fromDate &&
          allTeamsThemeResult.sadData[i].id <= toDate
        ) {
          sadResult.push(allTeamsThemeResult.sadData[i]);
        }
      }

      for (let i = 0; i < sadResult.length; i++) {
        for (let j = 0; j < sadResult[i].data.length; j++) {
          if (sadResult[i].data[j].key === external_Environment) {
            external_Environment_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Technology) {
            work_Technology_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === decision_Making) {
            decision_Making_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Sad_Value += sadResult[i].data[j].value;
          }
        }
      }

      // Neutral Loop
      for (let i = 0; i < allTeamsThemeResult.neutralData.length; i++) {
        if (
          allTeamsThemeResult.neutralData[i].id >= fromDate &&
          allTeamsThemeResult.neutralData[i].id <= toDate
        ) {
          neutralResult.push(allTeamsThemeResult.neutralData[i]);
        }
      }

      for (let i = 0; i < neutralResult.length; i++) {
        for (let j = 0; j < neutralResult[i].data.length; j++) {
          if (neutralResult[i].data[j].key === external_Environment) {
            external_Environment_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Technology) {
            work_Technology_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === decision_Making) {
            decision_Making_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Neutral_Value += neutralResult[i].data[j].value;
          }
        }
      }

      // Happy Loop
      for (let i = 0; i < allTeamsThemeResult.happyData.length; i++) {
        if (
          allTeamsThemeResult.happyData[i].id >= fromDate &&
          allTeamsThemeResult.happyData[i].id <= toDate
        ) {
          happyResult.push(allTeamsThemeResult.happyData[i]);
        }
      }

      for (let i = 0; i < happyResult.length; i++) {
        for (let j = 0; j < happyResult[i].data.length; j++) {
          if (happyResult[i].data[j].key === external_Environment) {
            external_Environment_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Technology) {
            work_Technology_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Happy_Value +=
              happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === decision_Making) {
            decision_Making_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Happy_Value += happyResult[i].data[j].value;
          }
        }
      }

      break;
    case "1":
      //  Sad Loop
      for (let i = 0; i < mobileTeamsThemeResult.sadData.length; i++) {
        if (
          mobileTeamsThemeResult.sadData[i].id >= fromDate &&
          mobileTeamsThemeResult.sadData[i].id <= toDate
        ) {
          sadResult.push(mobileTeamsThemeResult.sadData[i]);
        }
      }

      for (let i = 0; i < sadResult.length; i++) {
        for (let j = 0; j < sadResult[i].data.length; j++) {
          if (sadResult[i].data[j].key === external_Environment) {
            external_Environment_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Technology) {
            work_Technology_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === decision_Making) {
            decision_Making_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Sad_Value += sadResult[i].data[j].value;
          }
        }
      }

      // Neutral Loop
      for (let i = 0; i < mobileTeamsThemeResult.neutralData.length; i++) {
        if (
          mobileTeamsThemeResult.neutralData[i].id >= fromDate &&
          mobileTeamsThemeResult.neutralData[i].id <= toDate
        ) {
          neutralResult.push(mobileTeamsThemeResult.neutralData[i]);
        }
      }

      for (let i = 0; i < neutralResult.length; i++) {
        for (let j = 0; j < neutralResult[i].data.length; j++) {
          if (neutralResult[i].data[j].key === external_Environment) {
            external_Environment_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Technology) {
            work_Technology_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === decision_Making) {
            decision_Making_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Neutral_Value += neutralResult[i].data[j].value;
          }
        }
      }

      // Happy Loop
      for (let i = 0; i < mobileTeamsThemeResult.happyData.length; i++) {
        if (
          mobileTeamsThemeResult.happyData[i].id >= fromDate &&
          mobileTeamsThemeResult.happyData[i].id <= toDate
        ) {
          happyResult.push(mobileTeamsThemeResult.happyData[i]);
        }
      }

      for (let i = 0; i < happyResult.length; i++) {
        for (let j = 0; j < happyResult[i].data.length; j++) {
          if (happyResult[i].data[j].key === external_Environment) {
            external_Environment_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Technology) {
            work_Technology_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Happy_Value +=
              happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === decision_Making) {
            decision_Making_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Happy_Value += happyResult[i].data[j].value;
          }
        }
      }
      break;
    case "2":
      //  Sad Loop
      for (let i = 0; i < superannuationTeamThemeResult.sadData.length; i++) {
        if (
          superannuationTeamThemeResult.sadData[i].id >= fromDate &&
          superannuationTeamThemeResult.sadData[i].id <= toDate
        ) {
          sadResult.push(superannuationTeamThemeResult.sadData[i]);
        }
      }

      for (let i = 0; i < sadResult.length; i++) {
        for (let j = 0; j < sadResult[i].data.length; j++) {
          if (sadResult[i].data[j].key === external_Environment) {
            external_Environment_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Technology) {
            work_Technology_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === decision_Making) {
            decision_Making_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Sad_Value += sadResult[i].data[j].value;
          }
        }
      }

      // Neutral Loop
      for (
        let i = 0;
        i < superannuationTeamThemeResult.neutralData.length;
        i++
      ) {
        if (
          superannuationTeamThemeResult.neutralData[i].id >= fromDate &&
          superannuationTeamThemeResult.neutralData[i].id <= toDate
        ) {
          neutralResult.push(superannuationTeamThemeResult.neutralData[i]);
        }
      }

      for (let i = 0; i < neutralResult.length; i++) {
        for (let j = 0; j < neutralResult[i].data.length; j++) {
          if (neutralResult[i].data[j].key === external_Environment) {
            external_Environment_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Technology) {
            work_Technology_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === decision_Making) {
            decision_Making_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Neutral_Value += neutralResult[i].data[j].value;
          }
        }
      }

      // Happy Loop
      for (let i = 0; i < superannuationTeamThemeResult.happyData.length; i++) {
        if (
          superannuationTeamThemeResult.happyData[i].id >= fromDate &&
          superannuationTeamThemeResult.happyData[i].id <= toDate
        ) {
          happyResult.push(superannuationTeamThemeResult.happyData[i]);
        }
      }

      for (let i = 0; i < happyResult.length; i++) {
        for (let j = 0; j < happyResult[i].data.length; j++) {
          if (happyResult[i].data[j].key === external_Environment) {
            external_Environment_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Technology) {
            work_Technology_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Happy_Value +=
              happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === decision_Making) {
            decision_Making_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Happy_Value += happyResult[i].data[j].value;
          }
        }
      }
      break;
    case "3":
      //  Sad Loop
      for (let i = 0; i < insuranceTeamThemeResult.sadData.length; i++) {
        if (
          insuranceTeamThemeResult.sadData[i].id >= fromDate &&
          insuranceTeamThemeResult.sadData[i].id <= toDate
        ) {
          sadResult.push(insuranceTeamThemeResult.sadData[i]);
        }
      }

      for (let i = 0; i < sadResult.length; i++) {
        for (let j = 0; j < sadResult[i].data.length; j++) {
          if (sadResult[i].data[j].key === external_Environment) {
            external_Environment_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Technology) {
            work_Technology_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === decision_Making) {
            decision_Making_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Sad_Value += sadResult[i].data[j].value;
          }
          if (sadResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Sad_Value += sadResult[i].data[j].value;
          }
        }
      }

      // Neutral Loop
      for (let i = 0; i < insuranceTeamThemeResult.neutralData.length; i++) {
        if (
          insuranceTeamThemeResult.neutralData[i].id >= fromDate &&
          insuranceTeamThemeResult.neutralData[i].id <= toDate
        ) {
          neutralResult.push(insuranceTeamThemeResult.neutralData[i]);
        }
      }

      for (let i = 0; i < neutralResult.length; i++) {
        for (let j = 0; j < neutralResult[i].data.length; j++) {
          if (neutralResult[i].data[j].key === external_Environment) {
            external_Environment_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Technology) {
            work_Technology_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === decision_Making) {
            decision_Making_Neutral_Value += neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Neutral_Value +=
              neutralResult[i].data[j].value;
          }
          if (neutralResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Neutral_Value += neutralResult[i].data[j].value;
          }
        }
      }

      // Happy Loop
      for (let i = 0; i < insuranceTeamThemeResult.happyData.length; i++) {
        if (
          insuranceTeamThemeResult.happyData[i].id >= fromDate &&
          insuranceTeamThemeResult.happyData[i].id <= toDate
        ) {
          happyResult.push(insuranceTeamThemeResult.happyData[i]);
        }
      }

      for (let i = 0; i < happyResult.length; i++) {
        for (let j = 0; j < happyResult[i].data.length; j++) {
          if (happyResult[i].data[j].key === external_Environment) {
            external_Environment_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Technology) {
            work_Technology_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === individual_And_Team) {
            individual_And_Team_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === people_And_Resources) {
            people_And_Resources_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === structure_And_Capabilities) {
            structure_And_Capabilities_Happy_Value +=
              happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === decision_Making) {
            decision_Making_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === openness_to_Feedback) {
            openness_to_Feedback_Happy_Value += happyResult[i].data[j].value;
          }
          if (happyResult[i].data[j].key === work_Prioritisation) {
            work_Prioritisation_Happy_Value += happyResult[i].data[j].value;
          }
        }
      }
      break;

    default:
      break;
  }

  let sum_happy =
    external_Environment_Happy_Value +
    work_Technology_Happy_Value +
    individual_And_Team_Happy_Value +
    people_And_Resources_Happy_Value +
    structure_And_Capabilities_Happy_Value +
    decision_Making_Happy_Value +
    openness_to_Feedback_Happy_Value +
    work_Prioritisation_Happy_Value;

  let sum_neutral =
    external_Environment_Neutral_Value +
    work_Technology_Neutral_Value +
    individual_And_Team_Neutral_Value +
    people_And_Resources_Neutral_Value +
    structure_And_Capabilities_Neutral_Value +
    decision_Making_Neutral_Value +
    openness_to_Feedback_Neutral_Value +
    work_Prioritisation_Neutral_Value;

  let sum_sad =
    external_Environment_Sad_Value +
    work_Technology_Sad_Value +
    individual_And_Team_Sad_Value +
    people_And_Resources_Sad_Value +
    structure_And_Capabilities_Sad_Value +
    decision_Making_Sad_Value +
    openness_to_Feedback_Sad_Value +
    work_Prioritisation_Sad_Value;

  finalResult = {
    series: [
      //data on the y-axis
      {
        name: "Work Prioritisation",
        data: [
          work_Prioritisation_Sad_Value,
          work_Prioritisation_Neutral_Value,
          work_Prioritisation_Happy_Value,
        ],
      },
      {
        name: "Openness to Feedback",
        data: [
          openness_to_Feedback_Sad_Value,
          openness_to_Feedback_Neutral_Value,
          openness_to_Feedback_Happy_Value,
        ],
      },
      {
        name: "Decision Making",
        data: [
          decision_Making_Sad_Value,
          decision_Making_Neutral_Value,
          decision_Making_Happy_Value,
        ],
      },
      {
        name: "Structure & Capabilities",
        data: [
          structure_And_Capabilities_Sad_Value,
          structure_And_Capabilities_Neutral_Value,
          structure_And_Capabilities_Happy_Value,
        ],
      },
      {
        name: "People & Resources",
        data: [
          people_And_Resources_Sad_Value,
          people_And_Resources_Neutral_Value,
          people_And_Resources_Happy_Value,
        ],
      },
      {
        name: "Individual & Team",
        data: [
          individual_And_Team_Sad_Value,
          individual_And_Team_Neutral_Value,
          individual_And_Team_Happy_Value,
        ],
      },
      {
        name: "Work Technology & Tools",
        data: [
          work_Technology_Sad_Value,
          work_Technology_Neutral_Value,
          work_Technology_Happy_Value,
        ],
      },
      {
        name: "External Environment & Condition",
        data: [
          external_Environment_Sad_Value,
          external_Environment_Neutral_Value,
          external_Environment_Happy_Value,
        ],
      },
    ],
    happyPercentage: Math.round(
      (sum_happy / (sum_happy + sum_neutral + sum_sad)) * 100
    ),
    sadPercentage: Math.round(
      (sum_sad / (sum_happy + sum_neutral + sum_sad)) * 100
    ),
    neutralPercentage: Math.round(
      (sum_neutral / (sum_happy + sum_neutral + sum_sad)) * 100
    ),
  };

  return res.status(200).json({ result: finalResult });
});

// Chart 7: Api to get Enterprise Level Sentiments Moods
app.get("/getEnterpriseLevelSentimentsMoods", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let team = req.query.team;

  switch (team) {
    case "0":
      for (let i = 0; i < allTeamsMoodResult.length; i++) {
        if (
          allTeamsMoodResult[i].id >= fromDate &&
          allTeamsMoodResult[i].id <= toDate
        ) {
          finalResult.push(allTeamsMoodResult[i]);
        }
      }
      break;
    case "1":
      for (let i = 0; i < mobileTeamMoodResult.length; i++) {
        if (
          mobileTeamMoodResult[i].id >= fromDate &&
          mobileTeamMoodResult[i].id <= toDate
        ) {
          finalResult.push(mobileTeamMoodResult[i]);
        }
      }
      break;
    case "2":
      for (let i = 0; i < superannuationTeamMoodResult.length; i++) {
        if (
          superannuationTeamMoodResult[i].id >= fromDate &&
          superannuationTeamMoodResult[i].id <= toDate
        ) {
          finalResult.push(superannuationTeamMoodResult[i]);
        }
      }
      break;
    case "3":
      for (let i = 0; i < insuranceTeamMoodResult.length; i++) {
        if (
          insuranceTeamMoodResult[i].id >= fromDate &&
          insuranceTeamMoodResult[i].id <= toDate
        ) {
          finalResult.push(insuranceTeamMoodResult[i]);
        }
      }
      break;
    default:
      break;
  }
  return res.status(200).json({ result: finalResult });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
