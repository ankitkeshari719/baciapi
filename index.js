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
    console.log(data, "data");
    const jsonString = JSON.stringify(data, null, 2);

    const groupSuggestionString = `Please help me group these sentences into categories and give each category a name, dont use sentiment analysis for grouping.The group count should be less then 6, maximum 2 group should contain only one card. Then convert the response to json array.
    If you could not process or error then please provide with baciError300 only don't add other data. The sentences are present in array \n\n${jsonString}. Please don't consider if the sentences array is empty while returning drop that object,All categories should not contain one card each,one category can have one card.The responst must be like [{category:"xyz",sentences["one","other"]}]`;

    const completion = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [{ role: "user", content: groupSuggestionString }],
    });

    console.log(completion.data.choices[0], "suggestion");
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

// Api to get count of all participant over time
app.get("/getParticipantsCount", async (req, res) => {
  const result = [
    {
      id: 1,
      month: "Dec 22",
      averageParticipants: 15,
    },
    {
      id: 2,
      month: "Jan 23",
      averageParticipants: 27,
    },
    {
      id: 3,
      month: "Feb 23",
      averageParticipants: 18,
    },
    {
      id: 4,
      month: "Mar 23",
      averageParticipants: 20,
    },
    {
      id: 5,
      month: "Apr 23",
      averageParticipants: 23,
    },
    {
      id: 6,
      month: "May 23",
      averageParticipants: 17,
    },
    {
      id: 7,
      month: "June 23",
      averageParticipants: 15,
    },
  ];
  return res.status(200).json({ result: result });
});

// Api to get count of all retros over time
app.get("/getRetrosCount", async (req, res) => {
  const result = [
    {
      id: 1,
      month: "Dec 22",
      averageRetros: 15,
    },
    {
      id: 2,
      month: "Jan 23",
      averageRetros: 27,
    },
    {
      id: 3,
      month: "Feb 23",
      averageRetros: 18,
    },
    {
      id: 4,
      month: "Mar 23",
      averageRetros: 20,
    },
    {
      id: 5,
      month: "Apr 23",
      averageRetros: 23,
    },
    {
      id: 6,
      month: "May 23",
      averageRetros: 17,
    },
    {
      id: 7,
      month: "Jun 22",
      averageRetros: 15,
    },
  ];
  return res.status(200).json({ result: result });
});

// Api to get Team Level Actions Count
app.get("/getTeamLevelActionsCount", async (req, res) => {
  const result = [
    {
      id: 1,
      month: "Dec 22",
      assigned: 32,
      completed: 12,
    },
    {
      id: 2,
      month: "Jan 23",
      assigned: 33,
      completed: 2,
    },
    {
      id: 3,
      month: "Feb 23",
      assigned: 46,
      completed: 9,
    },
    {
      id: 4,
      month: "Mar 23",
      assigned: 15,
      completed: 18,
    },
    {
      id: 5,
      month: "Apr 23",
      assigned: 30,
      completed: 33,
    },
    {
      id: 6,
      month: "May 23",
      assigned: 18,
      completed: 3,
    },
    {
      id: 7,
      month: "Jun 22",
      assigned: 18,
      completed: 32,
    },
  ];
  return res.status(200).json({ result: result });
});

// Api to get Enterprise Level ActionsCount
app.get("/getEnterpriseLevelActionsCount", async (req, res) => {
  const result = [
    {
      id: 1,
      month: "Dec 22",
      assigned: 32,
      completed: 12,
    },
    {
      id: 2,
      month: "Jan 23",
      assigned: 33,
      completed: 2,
    },
    {
      id: 3,
      month: "Feb 23",
      assigned: 46,
      completed: 9,
    },
    {
      id: 4,
      month: "Mar 23",
      assigned: 15,
      completed: 18,
    },
    {
      id: 5,
      month: "Apr 23",
      assigned: 30,
      completed: 33,
    },
    {
      id: 6,
      month: "May 23",
      assigned: 18,
      completed: 3,
    },
    {
      id: 7,
      month: "Jun 22",
      assigned: 18,
      completed: 32,
    },
  ];
  return res.status(200).json({ result: result });
});

// Api to get Enterprise Level Sentiments Moods
app.get("/getEnterpriseLevelSentimentsMoods", async (req, res) => {
  const result = [
    {
      id: 1,
      month: "Dec 22",
      sad: 32,
      neutral: 12,
      happy: 56,
    },
    {
      id: 2,
      month: "Jan 23",
      sad: 44,
      neutral: 2,
      happy: 54,
    },
    {
      id: 3,
      month: "Feb 23",
      sad: 46,
      neutral: 9,
      happy: 45,
    },
    {
      id: 4,
      month: "Mar 23",
      sad: 15,
      neutral: 18,
      happy: 67,
    },
    {
      id: 5,
      month: "Apr 23",
      sad: 30,
      neutral: 20,
      happy: 50,
    },
    {
      id: 6,
      month: "May 23",
      sad: 18,
      neutral: 3,
      happy: 79,
    },
    {
      id: 7,
      month: "Jun 22",
      sad: 18,
      neutral: 32,
      happy: 50,
    },
  ];
  return res.status(200).json({ result: result });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
