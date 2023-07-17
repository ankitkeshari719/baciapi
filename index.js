const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
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

const BearerStrategy = require("passport-azure-ad").BearerStrategy;
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);
const axios = require("axios");
const urlApi = require("url");
const db = client.db(`bacidb`);
const collection = db.collection("retros");

//openAI
const { Configuration, OpenAIApi } = require("azure-openai");
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

const app = express();

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

app.post("/createRetro", async (req, res) => {
  let retro = req.body.retro;
  let creator = req.body.creator;
  console.log("serverTimestamp", Date.now());
  const result = await collection.insertOne({
    ...retro,
    creatorId: creator.id,
    timestamp: Date.now(),
    retroStatus: "waiting",
    waitingTimestamp: Date.now(),
  });
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

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}

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
      deleteOlderRetro(e._id);
    }
  });
};

// This cron-job will run at 00:30:00am
const job = nodeCron.schedule("0 30 0 * * *", function jobYouNeedToExecute() {
  getRetrosData();
});

//openAi
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

// Jira integration Changes
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

// Api to get dummy chart data
app.get("/getDummyChartData", async (req, res) => {
  const result = [
    {
      id: 1,
      date: "03/01/2022",
      average_temp: 15,
    },
    {
      id: 2,
      date: "03/02/2022",
      average_temp: 27,
    },
    {
      id: 3,
      date: "03/03/2022",
      average_temp: 18,
    },
    {
      id: 4,
      date: "03/04/2022",
      average_temp: 20,
    },
    {
      id: 5,
      date: "03/05/2022",
      average_temp: 23,
    },
    {
      id: 6,
      date: "03/06/2022",
      average_temp: 17,
    },
    {
      id: 7,
      date: "03/07/2022",
      average_temp: 15,
    },
  ];
  return res.status(200).json({ result: result });
});

// Chart 1:  Api to get Team Level Actions Count
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
      ((external_Environment_Happy_Value +
        work_Technology_Happy_Value +
        individual_And_Team_Happy_Value +
        people_And_Resources_Happy_Value +
        structure_And_Capabilities_Happy_Value +
        decision_Making_Happy_Value +
        openness_to_Feedback_Happy_Value +
        work_Prioritisation_Happy_Value) /
        8) *
        100
    ),
    sadPercentage: Math.round(
      ((external_Environment_Sad_Value +
        work_Technology_Sad_Value +
        individual_And_Team_Sad_Value +
        people_And_Resources_Sad_Value +
        structure_And_Capabilities_Sad_Value +
        decision_Making_Sad_Value +
        openness_to_Feedback_Sad_Value +
        work_Prioritisation_Sad_Value) /
        8) *
        100
    ),
    neutralPercentage: Math.round(
      ((external_Environment_Neutral_Value +
        work_Technology_Neutral_Value +
        individual_And_Team_Neutral_Value +
        people_And_Resources_Neutral_Value +
        structure_And_Capabilities_Neutral_Value +
        decision_Making_Neutral_Value +
        openness_to_Feedback_Neutral_Value +
        work_Prioritisation_Neutral_Value) /
        8) *
        100
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

// ------------------------------- Chart 1: TeamLevelActionsCounts ------------------------------//

const teamLevelActionCounts = [
  {
    id: 1,
    month: "Apr 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 2,
    month: "May 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 2 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    teams: [
      { name: "Mobile App Team", assigned: 4, completed: 0 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    teams: [
      { name: "Mobile App Team", assigned: 1, completed: 2 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 5 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 2 },
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 0, completed: 2 },
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    teams: [
      { name: "Mobile App Team", assigned: 2, completed: 2 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 0, completed: 2 },
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    teams: [
      { name: "Mobile App Team", assigned: 2, completed: 2 },
      { name: "Superannuation Team", assigned: 0, completed: 0 },
      { name: "Insurance Team", assigned: 0, completed: 0 },
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    teams: [
      { name: "Mobile App Team", assigned: 1, completed: 1 },
      { name: "Superannuation Team", assigned: 0, completed: 0 },
      { name: "Insurance Team", assigned: 0, completed: 0 },
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 1 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 0, completed: 0 },
      { name: "Insurance Team", assigned: 1, completed: 1 },
    ],
  },
  {
    id: 14,
    month: "May 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    teams: [
      { name: "Mobile App Team", assigned: 3, completed: 3 },
      { name: "Superannuation Team", assigned: 2, completed: 2 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    teams: [
      { name: "Mobile App Team", assigned: 2, completed: 2 },
      { name: "Superannuation Team", assigned: 1, completed: 1 },
      { name: "Insurance Team", assigned: 3, completed: 3 },
    ],
  },
];

// ------------------------------- Chart 2: EnterpriseLevelActionsCounts ------------------------------//

const allTeamsEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 25,
    completed: 20,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 41,
    completed: 36,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 35,
    completed: 35,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 30,
    completed: 21,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 22,
    completed: 26,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 57,
    completed: 52,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 89,
    completed: 99,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 67,
    completed: 67,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 78,
    completed: 78,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 77,
    completed: 45,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 73,
    completed: 70,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 89,
    completed: 80,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 95,
    completed: 99,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 82,
    completed: 65,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 88,
    completed: 34,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 91,
    completed: 23,
  },
];

const mobileTeamEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 25,
    completed: 20,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 41,
    completed: 36,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 35,
    completed: 35,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 30,
    completed: 21,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 22,
    completed: 26,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 57,
    completed: 52,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 89,
    completed: 99,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 67,
    completed: 67,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 78,
    completed: 78,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 77,
    completed: 45,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 73,
    completed: 70,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 89,
    completed: 80,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 95,
    completed: 99,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 82,
    completed: 65,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 88,
    completed: 34,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 91,
    completed: 23,
  },
];

const superannuationTeamEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 25,
    completed: 20,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 41,
    completed: 36,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 35,
    completed: 35,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 30,
    completed: 21,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 22,
    completed: 26,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 57,
    completed: 52,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 89,
    completed: 99,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 67,
    completed: 67,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 78,
    completed: 78,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 77,
    completed: 45,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 73,
    completed: 70,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 89,
    completed: 80,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 95,
    completed: 99,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 82,
    completed: 65,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 88,
    completed: 34,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 91,
    completed: 23,
  },
];

const insuranceTeamEnterpriseActionsResult = [
  {
    id: 1,
    month: "Apr 22",
    assigned: 25,
    completed: 20,
  },
  {
    id: 2,
    month: "May 22",
    assigned: 41,
    completed: 36,
  },
  {
    id: 3,
    month: "Jun 22",
    assigned: 35,
    completed: 35,
  },
  {
    id: 4,
    month: "Jul 22",
    assigned: 30,
    completed: 21,
  },
  {
    id: 5,
    month: "Aug 22",
    assigned: 22,
    completed: 26,
  },
  {
    id: 6,
    month: "Sep 22",
    assigned: 57,
    completed: 52,
  },
  {
    id: 7,
    month: "Oct 22",
    assigned: 89,
    completed: 99,
  },
  {
    id: 8,
    month: "Nov 22",
    assigned: 67,
    completed: 67,
  },
  {
    id: 9,
    month: "Dec 22",
    assigned: 78,
    completed: 78,
  },
  {
    id: 10,
    month: "Jan 23",
    assigned: 77,
    completed: 45,
  },
  {
    id: 11,
    month: "Feb 23",
    assigned: 73,
    completed: 70,
  },
  {
    id: 12,
    month: "Mar 23",
    assigned: 89,
    completed: 80,
  },
  {
    id: 13,
    month: "Apr 23",
    assigned: 95,
    completed: 99,
  },
  {
    id: 14,
    month: "May 23",
    assigned: 82,
    completed: 65,
  },
  {
    id: 15,
    month: "Jun 23",
    assigned: 88,
    completed: 34,
  },
  {
    id: 16,
    month: "Jul 23",
    assigned: 91,
    completed: 23,
  },
];

// ------------------------------- Chart 3: ParticipantsCount ------------------------------//

const allTeamsParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 55,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 78,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 101,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 95,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 82,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 121,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 320,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 511,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 570,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 677,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 930,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 1211,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 1350,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 1265,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 1200,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 1321,
  },
];

const mobileTeamParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 55,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 78,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 101,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 95,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 82,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 121,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 320,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 511,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 570,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 677,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 930,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 1211,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 1350,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 1265,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 1200,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 1321,
  },
];

const superannuationTeamParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 55,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 78,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 101,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 95,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 82,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 121,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 320,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 511,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 570,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 677,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 930,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 1211,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 1350,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 1265,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 1200,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 1321,
  },
];

const insuranceTeamParticipantResult = [
  {
    id: 1,
    month: "Apr 22",
    averageParticipants: 55,
  },
  {
    id: 2,
    month: "May 22",
    averageParticipants: 78,
  },
  {
    id: 3,
    month: "Jun 22",
    averageParticipants: 101,
  },
  {
    id: 4,
    month: "Jul 22",
    averageParticipants: 95,
  },
  {
    id: 5,
    month: "Aug 22",
    averageParticipants: 82,
  },
  {
    id: 6,
    month: "Sep 22",
    averageParticipants: 121,
  },
  {
    id: 7,
    month: "Oct 22",
    averageParticipants: 320,
  },
  {
    id: 8,
    month: "Nov 22",
    averageParticipants: 511,
  },
  {
    id: 9,
    month: "Dec 22",
    averageParticipants: 570,
  },
  {
    id: 10,
    month: "Jan 23",
    averageParticipants: 677,
  },
  {
    id: 11,
    month: "Feb 23",
    averageParticipants: 930,
  },
  {
    id: 12,
    month: "Mar 23",
    averageParticipants: 1211,
  },
  {
    id: 13,
    month: "Apr 23",
    averageParticipants: 1350,
  },
  {
    id: 14,
    month: "May 23",
    averageParticipants: 1265,
  },
  {
    id: 15,
    month: "Jun 23",
    averageParticipants: 1200,
  },
  {
    id: 16,
    month: "Jul 23",
    averageParticipants: 1321,
  },
];

// ------------------------------- Chart 4: RetrosCounts ------------------------------//

const allTeamsSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 22,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 31,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 40,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 38,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 32,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 48,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 128,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 204,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 228,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 270,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 372,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 485,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 540,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 506,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 480,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 528,
  },
];

const mobileTeamSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 22,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 31,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 40,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 38,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 32,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 48,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 128,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 204,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 228,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 270,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 372,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 485,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 540,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 506,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 480,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 528,
  },
];

const superannuationTeamSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 22,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 31,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 40,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 38,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 32,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 48,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 128,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 204,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 228,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 270,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 372,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 485,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 540,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 506,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 480,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 528,
  },
];

const insuranceTeamSessionResult = [
  {
    id: 1,
    month: "Apr 22",
    averageRetros: 22,
  },
  {
    id: 2,
    month: "May 22",
    averageRetros: 31,
  },
  {
    id: 3,
    month: "Jun 22",
    averageRetros: 40,
  },
  {
    id: 4,
    month: "Jul 22",
    averageRetros: 38,
  },
  {
    id: 5,
    month: "Aug 22",
    averageRetros: 32,
  },
  {
    id: 6,
    month: "Sep 22",
    averageRetros: 48,
  },
  {
    id: 7,
    month: "Oct 22",
    averageRetros: 128,
  },
  {
    id: 8,
    month: "Nov 22",
    averageRetros: 204,
  },
  {
    id: 9,
    month: "Dec 22",
    averageRetros: 228,
  },
  {
    id: 10,
    month: "Jan 23",
    averageRetros: 270,
  },
  {
    id: 11,
    month: "Feb 23",
    averageRetros: 372,
  },
  {
    id: 12,
    month: "Mar 23",
    averageRetros: 485,
  },
  {
    id: 13,
    month: "Apr 23",
    averageRetros: 540,
  },
  {
    id: 14,
    month: "May 23",
    averageRetros: 506,
  },
  {
    id: 15,
    month: "Jun 23",
    averageRetros: 480,
  },
  {
    id: 16,
    month: "Jul 23",
    averageRetros: 528,
  },
];

// ------------------------------- Chart 5: EnterpriseLevelSentimentSummary ------------------------------//

const allTeamsSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

const mobileTeamSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

const superannuationTeamSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

const insuranceTeamSummaryResult = [
  {
    id: 1,
    month: "Apr 22",
    summary:
      "It seems that people are feeling a sense of collaboration and teamwork. They appreciate the fact that the work was not done solely by themselves and that there was good communication through Slack.  The constant peer review suggests a culture of feedback and improvement. The approach of dividing and conquering sections of the work indicates efficient task allocation. The mention of learning and development highlights a focus on personal and professional growth. The elevator music during retro suggests a relaxed and enjoyable working environment. The quick delivery of initial dot points implies efficiency and responsiveness. Overall, the team seems open-minded, receptive to feedback, and working together on different sections, creating a positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Appreciation",
      "Communication",
      "Slack",
      "Peer review",
      "Feedback",
      "Improvement",
      "Task allocation",
      "Learning",
      "Development",
      "Personal",
      "Professional",
      "Environment",
      "Efficiency",
    ],
  },
  {
    id: 2,
    month: "May 22",
    summary:
      "The team demonstrates satisfactory performance, meeting basic expectations but lacking the ability to consistently excel. They exhibit a moderate level of collaboration, but there are occasional breakdowns in communication that hinder their progress. The team's attention to detail is acceptable, but there is room for improvement in terms of consistently delivering high-quality work. Their reactive approach sometimes leaves them struggling to proactively address challenges and seize opportunities. Despite making some efforts towards improvement, the team's performance remains average and fails to stand out from their peers. Overall, there is a need for greater focus, proactive problem-solving, and a stronger drive for excellence in order to elevate the team's performance to a higher level of success.",
    keywords: [
      "Satisfactory",
      "Moderate",
      "Breakdowns",
      "Acceptable",
      "Improvement",
      "Average",
      "Proactive",
      "Challenges",
      "Opportunities",
      "Efforts",
      "Focus",
      "Problem-solving",
      "Drive",
      "Excellence",
      "Success",
    ],
  },
  {
    id: 3,
    month: "Jun 22",
    summary:
      "The team appears to exhibit a moderate level of collaboration and teamwork. They acknowledge the importance of working together and value communication. While they engage in some peer review, there is room for improvement in terms of feedback and fostering a culture of continuous growth. Task allocation seems somewhat efficient with a division of work. They show a slight inclination towards learning and development. The presence of elevator music during retrospectives suggests a relatively relaxed working environment. The team demonstrates a moderate level of efficiency and responsiveness in delivering initial dot points. Overall, they display a certain level of openness and receptiveness to feedback while working on different sections, contributing to a moderately positive and collaborative atmosphere.",
    keywords: [
      "Collaboration",
      "Teamwork",
      "Communication",
      "Peer review",
      "Feedback",
      "Continuous growth",
      "Task allocation",
      "Efficiency",
      "Learning",
      "Development",
      "Relaxed",
      "Environment",
      "Responsiveness",
      "Openness",
      "Receptiveness",
    ],
  },
  {
    id: 4,
    month: "Jul 22",
    summary:
      "The team exemplifies a strong sense of synergy and mutual support, working together seamlessly to achieve their goals. They prioritize effective communication and actively foster an atmosphere of trust and respect. Through their cohesive efforts, they overcome challenges and demonstrate exceptional problem-solving skills. The team's innovative thinking and creative approaches generate fresh perspectives and propel them towards success. They embrace change and adaptability, consistently seeking new opportunities for growth and improvement. The team's dedication to excellence is evident in their meticulous attention to detail and commitment to delivering high-quality outcomes. With their unwavering focus on customer satisfaction, they consistently exceed expectations and maintain strong client relationships. Overall, this team embodies a spirit of innovation, collaboration, and unwavering commitment, making them a force to be reckoned with in their field.",
    keywords: [
      "Synergy",
      "Support",
      "Communication",
      "Trust",
      "Respect",
      "Cohesion",
      "Problem-solving",
      "Innovation",
      "Creativity",
      "Adaptability",
      "Growth",
      "Excellence",
      "Attention to detail",
      "Customer satisfaction",
      "Commitment",
    ],
  },
  {
    id: 5,
    month: "Aug 22",
    summary:
      "The team struggles to foster a cohesive and collaborative environment, often facing communication challenges and a lack of teamwork. Feedback and improvement are often overlooked, resulting in a stagnant culture that inhibits growth. Task allocation is inefficient, leading to delays and subpar productivity. Limited emphasis on learning and development hinders personal and professional growth. The working environment lacks enthusiasm and enjoyment, lacking the necessary elements to foster a positive atmosphere. Timeliness and responsiveness are areas that require improvement, as the team struggles to deliver prompt and efficient results. Overall, the team exhibits a lack of openness and receptiveness to feedback, hindering their ability to work together effectively and create a truly collaborative atmosphere.",
    keywords: [
      "Struggle",
      "Cohesion",
      "Collaboration",
      "Communication",
      "Teamwork",
      "Feedback",
      "Improvement",
      "Stagnant",
      "Inhibit",
      "Inefficiency",
      "Delays",
      "Productivity",
      "Learning",
      "Development",
      "Enthusiasm",
    ],
  },
  {
    id: 6,
    month: "Sep 22",
    summary:
      "The team thrives in a vibrant and enjoyable culture, embracing a strong sense of camaraderie and creating a positive work environment. They value open communication, fostering connections, and building strong relationships. The team actively supports one another, cultivating a sense of unity and shared purpose. They prioritize work-life balance, encouraging well-being and personal growth. In this uplifting atmosphere, creativity flourishes, leading to inspired ideas and solutions. The team takes pleasure in their work, finding joy and fulfillment in their collective achievements. With their infectious enthusiasm, they radiate positivity and inspire others to embrace the culture they've cultivated. Overall, this team demonstrates a remarkable ability to enjoy the culture they've created, fostering a sense of fulfillment and satisfaction in their daily work experiences.",
    keywords: [
      "Thriving",
      "Vibrant",
      "Enjoyable",
      "Camaraderie",
      "Positive",
      "Open communication",
      "Connections",
      "Strong relationships",
      "Supportive",
      "Unity",
      "Purpose",
      "Work-life balance",
      "Well-being",
      "Creativity",
      "Fulfillment",
    ],
  },
  {
    id: 7,
    month: "Oct 22",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, but there are opportunities for improvement. While they maintain some communication, there is room for enhancing collaboration and building stronger connections. They demonstrate a certain level of support for one another, but further efforts are needed to foster a more cohesive and unified environment. The team shows potential for personal growth, but there is a need for greater emphasis on individual development. Although they find some enjoyment in their work, there is room for cultivating a more positive and enthusiastic atmosphere. Overall, the team has the potential to enhance their work culture by investing in stronger communication, deeper collaboration, and a more uplifting environment, which would contribute to a more fulfilling and satisfying work experience.",
    keywords: [
      "Engagement",
      "Improvement",
      "Communication",
      "Collaboration",
      "Connection",
      "Support",
      "Cohesion",
      "Unity",
      "Growth",
      "Development",
      "Enjoyment",
      "Positivity",
      "Enthusiasm",
      "Potential",
      "Fulfillment",
    ],
  },
  {
    id: 8,
    month: "Nov 22",
    summary:
      "The team demonstrates a remarkable level of autonomy, with individuals taking ownership of their work and showing a high degree of self-reliance. They excel in effective communication, providing each other with necessary information and support when needed. The team's strong sense of independence allows for efficient decision-making and swift problem-solving. They exhibit a proclivity for taking initiative, actively seeking opportunities to contribute and make meaningful contributions to their projects. The team's autonomy fosters a sense of empowerment, allowing individuals to showcase their unique skills and talents. Overall, the team's ability to work autonomously not only promotes individual growth but also contributes to a dynamic and productive work environment where each member feels empowered to drive success.",
    keywords: [
      "Autonomy",
      "Ownership",
      "Self-reliance",
      "Communication",
      "Support",
      "Independence",
      "Decision-making",
      "Problem-solving",
      "Initiative",
      "Contribution",
      "Empowerment",
      "Skills",
      "Talents",
      "Growth",
      "Success",
    ],
  },
  {
    id: 9,
    month: "Dec 22",
    summary:
      "The team is led by a capable and inspiring leadership that sets a strong example for others. Their visionary guidance provides clarity of purpose and direction, empowering team members to reach their full potential. The leaders foster a culture of trust, openness, and collaboration, encouraging active participation and valuing diverse perspectives. They effectively communicate expectations and provide support, ensuring everyone is equipped with the resources needed to succeed. With their keen understanding of individual strengths, the leaders skillfully delegate tasks and allocate responsibilities, maximizing productivity and fostering a sense of ownership. The team benefits from the leaders' mentorship and guidance, creating a nurturing environment that promotes both personal and professional growth. Overall, the team thrives under the exceptional leadership, working cohesively towards shared goals and achieving remarkable outcomes.",
    keywords: [
      "Capable",
      "Inspiring",
      "Visionary",
      "Clarity",
      "Empowerment",
      "Trust",
      "Openness",
      "Collaboration",
      "Participation",
      "Diversity",
      "Communication",
      "Support",
      "Resources",
      "Delegation",
      "Mentorship",
    ],
  },
  {
    id: 10,
    month: "Jan 23",
    summary:
      "The team consistently delivers outstanding performance, surpassing expectations and setting a high standard for excellence. Their unwavering dedication and strong work ethic drive them towards success. They exhibit exceptional collaboration, effectively pooling their skills and knowledge to achieve collective goals. The team's synergy and seamless coordination enable them to tackle complex projects with ease. Their consistent focus on results and attention to detail ensure impeccable outcomes. The team's proactive approach and ability to adapt to changing circumstances showcase their agility and resilience. With a continuous commitment to improvement, they actively seek opportunities to enhance their performance and optimize their processes. Overall, the team's remarkable performance is a testament to their exceptional skills, teamwork, and relentless pursuit of excellence, making them a force to be reckoned with in their domain.",
    keywords: [
      "Outstanding",
      "Surpassing",
      "Excellence",
      "Dedication",
      "Work ethic",
      "Collaboration",
      "Synergy",
      "Coordination",
      "Results-focused",
      "Attention to detail",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Remarkable",
    ],
  },
  {
    id: 11,
    month: "Feb 23",
    summary:
      "The team struggles to consistently meet performance expectations, often falling short of desired outcomes. They face challenges in effective collaboration and fail to leverage their collective strengths. Coordination and communication issues hinder their ability to work cohesively towards shared goals. The team's attention to detail and commitment to results are lacking, resulting in subpar deliverables. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, causing delays and setbacks. Despite some efforts towards improvement, the team's performance remains inconsistent and fails to meet desired standards. Overall, there is a clear need for stronger coordination, enhanced communication, and a more proactive mindset to address the team's performance shortcomings and achieve desired results.",
    keywords: [
      "Struggle",
      "Performance",
      "Expectations",
      "Collaboration",
      "Strengths",
      "Coordination",
      "Communication",
      "Cohesiveness",
      "Attention to detail",
      "Commitment",
      "Subpar",
      "Reactive",
      "Setbacks",
      "Inconsistent",
      "Improvement",
    ],
  },
  {
    id: 12,
    month: "Mar 23",
    summary:
      "The team embodies a spirit of adaptability and resilience, readily embracing change and tackling challenges head-on. Their open-mindedness and flexible approach allow them to navigate complex situations with ease. Effective communication and strong collaboration form the foundation of their work dynamic, fostering a harmonious and supportive environment. With a keen eye for detail and a commitment to quality, they consistently strive for excellence in their deliverables. The team's passion for continuous learning and growth is evident, as they actively seek opportunities to expand their skills and knowledge. Their shared enthusiasm and positive energy create a motivating atmosphere that fuels creativity and innovation. With their proactive mindset and efficient workflow, they consistently meet deadlines and exceed expectations. Overall, this team's adaptability, collaboration, and dedication to continuous improvement position them as a formidable force in their field.",
    keywords: [
      "Adaptability",
      "Resilience",
      "Open-mindedness",
      "Flexibility",
      "Communication",
      "Collaboration",
      "Harmony",
      "Supportive",
      "Detail-oriented",
      "Quality-focused",
      "Continuous learning",
      "Growth",
      "Enthusiasm",
      "Positive energy",
      "Proactive",
    ],
  },
  {
    id: 13,
    month: "Apr 23",
    summary:
      "The team's performance falls below expectations, struggling to meet the desired standards. They face significant challenges in collaboration, often experiencing breakdowns in communication and a lack of cohesive teamwork. The team's attention to detail is lacking, leading to errors and subpar work quality. Their reactive approach leaves them ill-prepared to handle unexpected obstacles, resulting in delays and missed opportunities. Despite some attempts at improvement, the team's performance remains consistently below average. Overall, there is a clear need for a major overhaul in their communication, teamwork, and attention to detail to bridge the performance gaps and achieve the desired level of success.",
    keywords: [
      "Under performance",
      "Struggle",
      "Collaboration",
      "Breakdowns",
      "Communication",
      "Teamwork",
      "Attention to detail",
      "Errors",
      "Subpar",
      "Reactive",
      "Delays",
      "Missed opportunities",
      "Improvement",
      "Overhaul",
      "Performance gaps",
    ],
  },
  {
    id: 14,
    month: "May 23",
    summary:
      "The team demonstrates a satisfactory level of performance, consistently meeting expectations and striving for improvement. They display a moderate level of collaboration, working together to overcome challenges and achieve their goals. While there may be occasional communication gaps, the team shows potential for stronger coordination and fostering a more cohesive environment. They exhibit a reasonable attention to detail, ensuring the quality of their work is generally acceptable. Although their approach can be reactive at times, the team is adaptable and willing to learn from past experiences. With ongoing efforts towards improvement, they have the potential to elevate their performance to a higher level. Overall, the team's dedication and willingness to grow contribute to a positive outlook, suggesting they are on a trajectory towards greater success.",
    keywords: [
      "Satisfactory",
      "Consistent",
      "Improvement",
      "Collaboration",
      "Challenges",
      "Goals",
      "Communication",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Reactive",
      "Adaptable",
      "Learning",
      "Growth",
      "Potential",
    ],
  },
  {
    id: 15,
    month: "Jun 23",
    summary:
      "The team consistently delivers exceptional performance, exceeding expectations and setting a standard of excellence. They showcase a remarkable level of collaboration, seamlessly working together towards common goals. Effective communication and mutual support foster a cohesive and harmonious environment. The team's meticulous attention to detail ensures top-notch quality in their work, leaving no room for errors. Their proactive approach allows them to anticipate and address challenges before they become obstacles. The team's adaptability and resilience enable them to navigate complex situations with ease, turning setbacks into opportunities for growth. With their continuous drive for improvement, they consistently raise the bar and strive for even greater achievements. Overall, the team's exceptional performance, combined with their dedication and positive mindset, positions them as a true powerhouse in their field.",
    keywords: [
      "Exceptional",
      "Exceeding",
      "Collaboration",
      "Seamless",
      "Communication",
      "Support",
      "Cohesive",
      "Harmonious",
      "Meticulous",
      "Quality",
      "Proactive",
      "Adaptability",
      "Resilience",
      "Growth",
      "Achievement",
    ],
  },
  {
    id: 16,
    month: "Jul 23",
    summary:
      "The team thrives under exceptional leadership, guided by visionary individuals who inspire and empower their members. Their leaders demonstrate a clear sense of direction and purpose, setting high standards and encouraging the team to reach their full potential. Through effective communication and active listening, they foster a culture of trust and collaboration. The leaders value the unique strengths and contributions of each team member, skillfully leveraging their skills for optimal performance. They provide guidance and support, enabling individuals to grow both personally and professionally. With their inspiring leadership, the team feels motivated and driven to achieve extraordinary results. The leaders' unwavering dedication to the team's success creates a positive and uplifting work environment. Overall, the team's exceptional performance is a testament to the transformative impact of their leaders, who inspire greatness and guide the team towards continuous success.",
    keywords: [
      "Thriving",
      "Exceptional",
      "Visionary",
      "Inspire",
      "Empower",
      "Direction",
      "Purpose",
      "High standards",
      "Trust",
      "Collaboration",
      "Value",
      "Guidance",
      "Support",
      "Motivated",
      "Success",
    ],
  },
  {
    id: 17,
    month: "Last 3 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, striving for improvement and displaying moderate collaboration. There is potential for stronger coordination and a more cohesive environment. They exhibit reasonable attention to detail and are adaptable in learning from past experiences. The team consistently exceeds expectations, showcasing exceptional collaboration and effective communication. Their meticulous attention to detail and proactive approach contribute to top-notch quality and the ability to anticipate challenges. Their adaptability and resilience enable them to navigate complex situations. Under exceptional leadership, the team is motivated, guided, and empowered to reach their full potential. The leaders foster a culture of trust and collaboration, valuing each team member's unique strengths. The team's exceptional performance is a testament to their transformative leaders, inspiring continuous success. Overall, the team's dedication, positive mindset, and exceptional leadership position them as a powerhouse in their field.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate collaboration",
      "Coordination",
      "Cohesive",
      "Attention to detail",
      "Adaptable",
      "Exceeding expectations",
      "Exceptional collaboration",
      "Effective communication",
      "Anticipation",
      "Adaptability",
      "Resilience",
      "Leadership",
      "Empowerment",
    ],
  },
  {
    id: 18,
    month: "Last 6 Months",
    summary:
      "The team demonstrates a satisfactory level of performance, with potential for improvement. They exhibit a moderate level of collaboration, working together to overcome challenges. Communication gaps and coordination issues hinder their progress. Attention to detail and commitment to results require strengthening, leading to subpar deliverables. Their reactive approach creates delays and setbacks. However, their adaptability and resilience enable them to navigate complex situations. The team's proactive mindset, efficiency, and dedication to continuous learning foster a positive and motivating environment. They consistently strive for excellence and exceed expectations. Exceptional leadership sets high standards, fosters trust, and empowers team members. Overall, the team's remarkable performance, adaptability, collaboration, and leadership contribute to their position as a formidable force in their field. With stronger coordination, enhanced communication, and a proactive mindset, they can bridge performance gaps and achieve desired success.",
    keywords: [
      "Satisfactory",
      "Improvement",
      "Moderate",
      "Coordination",
      "Cohesion",
      "Detail",
      "Adaptable",
      "Expectations",
      "Collaboration",
      "Communication",
      "Proactive",
      "Quality",
      "Anticipate",
      "Resilience",
      "Leadership",
    ],
  },
  {
    id: 19,
    month: "Last 12 Months",
    summary:
      "The team exhibits a moderate level of engagement in their work culture, with opportunities for improvement. They demonstrate collaboration potential, yet stronger coordination and a cohesive environment are needed. There is reasonable attention to detail and adaptability to learn from past experiences. Exceptional performance defines the team, as they exceed expectations and display remarkable collaboration. Effective communication and mutual support foster a harmonious environment. Meticulous attention to detail ensures high-quality work, while a proactive approach anticipates and addresses challenges. The team's adaptability and resilience allow them to navigate complex situations. Under exceptional leadership, team members feel motivated and empowered, resulting in exceptional performance. Overall, the team shows potential for growth, with dedication and a positive outlook. Exceptional leadership drives success and creates a positive work environment.",
    keywords: [
      "Outstanding performance",
      "Collaboration",
      "Adaptability",
      "Resilience",
      "Continuous improvement",
      "Agility",
      "Excellence",
      "Proactive",
      "Innovation",
      "Trust",
      "Supportive environment",
      "Learning and growth",
      "Enthusiasm",
      "Positive energy",
      "Exceptional leadership",
    ],
  },
];

// ------------------------------- Chart 6: EnterpriseLevelSentimentsTheme ------------------------------//

const allTeamsThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 60,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 70,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 50,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 40,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 65,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 59,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 45,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 60,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 55,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 75,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 55,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 35,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
};
const mobileTeamsThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 60,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 70,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 50,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 40,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 65,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 59,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 45,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 60,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 55,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 75,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 55,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 35,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
};

const superannuationTeamThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 60,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 70,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 50,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 40,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 65,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 59,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 45,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 60,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 55,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 75,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 55,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 35,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
};

const insuranceTeamThemeResult = {
  sadData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 15,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 20,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 15,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
  ],
  neutralData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 10,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 10,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 10,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 50,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 15,
        },
        {
          key: "Individual & Team",
          value: 60,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 25,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 70,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 50,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 10,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 40,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 65,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 20,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 59,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 55,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 65,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 70,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 60,
        },
        {
          key: "Work Technology & Tools",
          value: 45,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 30,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 20,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 65,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 25,
        },
        {
          key: "Decision Making",
          value: 15,
        },
        {
          key: "Openness to Feedback",
          value: 60,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 65,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 60,
        },
        {
          key: "Decision Making",
          value: 25,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
  happyData: [
    {
      id: 1,
      month: "Apr 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 2,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 3,
      month: "Jun 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 55,
        },
        {
          key: "Individual & Team",
          value: 75,
        },
        {
          key: "People & Resources",
          value: 60,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 65,
        },
      ],
    },
    {
      id: 4,
      month: "Jul 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 15,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 25,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 5,
      month: "Aug 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 10,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 40,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 50,
        },
        {
          key: "Work Prioritisation",
          value: 25,
        },
      ],
    },
    {
      id: 6,
      month: "Sep 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 30,
        },
        {
          key: "Work Technology & Tools",
          value: 60,
        },
        {
          key: "Individual & Team",
          value: 25,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 30,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 7,
      month: "Oct 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 55,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 8,
      month: "Nov 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 15,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 30,
        },
        {
          key: "Structure & Capabilities",
          value: 40,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 20,
        },
      ],
    },
    {
      id: 9,
      month: "Dec 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 30,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 75,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 75,
        },
        {
          key: "Work Prioritisation",
          value: 55,
        },
      ],
    },
    {
      id: 10,
      month: "Jan 232",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 30,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 20,
        },
        {
          key: "Structure & Capabilities",
          value: 30,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 55,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 11,
      month: "Feb 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 35,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 40,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 55,
        },
        {
          key: "Decision Making",
          value: 45,
        },
        {
          key: "Openness to Feedback",
          value: 45,
        },
        {
          key: "Work Prioritisation",
          value: 35,
        },
      ],
    },
    {
      id: 12,
      month: "Mar 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 40,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 35,
        },
        {
          key: "Structure & Capabilities",
          value: 20,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 15,
        },
      ],
    },
    {
      id: 13,
      month: "Apr 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 35,
        },
        {
          key: "Decision Making",
          value: 40,
        },
        {
          key: "Openness to Feedback",
          value: 40,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 14,
      month: "May 22",
      data: [
        {
          key: "External Environment & Conditions",
          value: 45,
        },
        {
          key: "Work Technology & Tools",
          value: 50,
        },
        {
          key: "Individual & Team",
          value: 55,
        },
        {
          key: "People & Resources",
          value: 50,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 35,
        },
        {
          key: "Openness to Feedback",
          value: 30,
        },
        {
          key: "Work Prioritisation",
          value: 60,
        },
      ],
    },
    {
      id: 15,
      month: "Jun 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 25,
        },
        {
          key: "Work Technology & Tools",
          value: 20,
        },
        {
          key: "Individual & Team",
          value: 35,
        },
        {
          key: "People & Resources",
          value: 45,
        },
        {
          key: "Structure & Capabilities",
          value: 45,
        },
        {
          key: "Decision Making",
          value: 60,
        },
        {
          key: "Openness to Feedback",
          value: 15,
        },
        {
          key: "Work Prioritisation",
          value: 45,
        },
      ],
    },
    {
      id: 16,
      month: "Jul 23",
      data: [
        {
          key: "External Environment & Conditions",
          value: 20,
        },
        {
          key: "Work Technology & Tools",
          value: 35,
        },
        {
          key: "Individual & Team",
          value: 45,
        },
        {
          key: "People & Resources",
          value: 25,
        },
        {
          key: "Structure & Capabilities",
          value: 10,
        },
        {
          key: "Decision Making",
          value: 50,
        },
        {
          key: "Openness to Feedback",
          value: 35,
        },
        {
          key: "Work Prioritisation",
          value: 40,
        },
      ],
    },
  ],
};

// ------------------------------- Chart 7: EnterpriseLevelSentimentsMoods ------------------------------//
const allTeamsMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 5,
    neutral: 40,
    happy: 10,
  },
  {
    id: 2,
    month: "May 22",
    sad: 18,
    neutral: 20,
    happy: 40,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 20,
    neutral: 26,
    happy: 55,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 10,
    neutral: 31,
    happy: 54,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 12,
    neutral: 16,
    happy: 54,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 12,
    neutral: 42,
    happy: 47,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 45,
    neutral: 74,
    happy: 201,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 50,
    neutral: 28,
    happy: 433,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 43,
    neutral: 71,
    happy: 456,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 55,
    neutral: 114,
    happy: 508,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 60,
    neutral: 38,
    happy: 832,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 67,
    neutral: 133,
    happy: 1011,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 66,
    neutral: 239,
    happy: 1045,
  },
  {
    id: 14,
    month: "May 23",
    sad: 54,
    neutral: 211,
    happy: 1000,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 76,
    neutral: 24,
    happy: 1100,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 78,
    neutral: 115,
    happy: 1155,
  },
];

const mobileTeamMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 5,
    neutral: 40,
    happy: 10,
  },
  {
    id: 2,
    month: "May 22",
    sad: 18,
    neutral: 20,
    happy: 40,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 20,
    neutral: 26,
    happy: 55,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 10,
    neutral: 31,
    happy: 54,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 12,
    neutral: 16,
    happy: 54,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 12,
    neutral: 42,
    happy: 47,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 45,
    neutral: 74,
    happy: 201,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 50,
    neutral: 28,
    happy: 433,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 43,
    neutral: 71,
    happy: 456,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 55,
    neutral: 114,
    happy: 508,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 60,
    neutral: 38,
    happy: 832,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 67,
    neutral: 133,
    happy: 1011,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 66,
    neutral: 239,
    happy: 1045,
  },
  {
    id: 14,
    month: "May 23",
    sad: 54,
    neutral: 211,
    happy: 1000,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 76,
    neutral: 24,
    happy: 1100,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 78,
    neutral: 115,
    happy: 1155,
  },
];

const superannuationTeamMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 5,
    neutral: 40,
    happy: 10,
  },
  {
    id: 2,
    month: "May 22",
    sad: 18,
    neutral: 20,
    happy: 40,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 20,
    neutral: 26,
    happy: 55,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 10,
    neutral: 31,
    happy: 54,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 12,
    neutral: 16,
    happy: 54,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 12,
    neutral: 42,
    happy: 47,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 45,
    neutral: 74,
    happy: 201,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 50,
    neutral: 28,
    happy: 433,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 43,
    neutral: 71,
    happy: 456,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 55,
    neutral: 114,
    happy: 508,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 60,
    neutral: 38,
    happy: 832,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 67,
    neutral: 133,
    happy: 1011,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 66,
    neutral: 239,
    happy: 1045,
  },
  {
    id: 14,
    month: "May 23",
    sad: 54,
    neutral: 211,
    happy: 1000,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 76,
    neutral: 24,
    happy: 1100,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 78,
    neutral: 115,
    happy: 1155,
  },
];

const insuranceTeamMoodResult = [
  {
    id: 1,
    month: "Apr 22",
    sad: 5,
    neutral: 40,
    happy: 10,
  },
  {
    id: 2,
    month: "May 22",
    sad: 18,
    neutral: 20,
    happy: 40,
  },
  {
    id: 3,
    month: "Jun 22",
    sad: 20,
    neutral: 26,
    happy: 55,
  },
  {
    id: 4,
    month: "Jul 22",
    sad: 10,
    neutral: 31,
    happy: 54,
  },
  {
    id: 5,
    month: "Aug 22",
    sad: 12,
    neutral: 16,
    happy: 54,
  },
  {
    id: 6,
    month: "Sep 22",
    sad: 12,
    neutral: 42,
    happy: 47,
  },
  {
    id: 7,
    month: "Oct 22",
    sad: 45,
    neutral: 74,
    happy: 201,
  },
  {
    id: 8,
    month: "Nov 22",
    sad: 50,
    neutral: 28,
    happy: 433,
  },
  {
    id: 9,
    month: "Dec 22",
    sad: 43,
    neutral: 71,
    happy: 456,
  },
  {
    id: 10,
    month: "Jan 23",
    sad: 55,
    neutral: 114,
    happy: 508,
  },
  {
    id: 11,
    month: "Feb 23",
    sad: 60,
    neutral: 38,
    happy: 832,
  },
  {
    id: 12,
    month: "Mar 23",
    sad: 67,
    neutral: 133,
    happy: 1011,
  },
  {
    id: 13,
    month: "Apr 23",
    sad: 66,
    neutral: 239,
    happy: 1045,
  },
  {
    id: 14,
    month: "May 23",
    sad: 54,
    neutral: 211,
    happy: 1000,
  },
  {
    id: 15,
    month: "Jun 22",
    sad: 76,
    neutral: 24,
    happy: 1100,
  },
  {
    id: 16,
    month: "Jul 23",
    sad: 78,
    neutral: 115,
    happy: 1155,
  },
];

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
