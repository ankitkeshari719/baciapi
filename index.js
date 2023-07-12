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
  const result = [
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
  for (let i = 0; i < result.length; i++) {
    if (result[i].id >= fromDate && result[i].id <= toDate) {
      console.log();
      finalResult.push(result[i]);
    }
  }
  return res.status(200).json({ result: finalResult });
});

// Chart 2: Api to get Enterprise Level ActionsCount
app.get("/getEnterpriseLevelActionsCounts", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  const result = [
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
  for (let i = 0; i < result.length; i++) {
    if (result[i].id >= fromDate && result[i].id <= toDate) {
      console.log();
      finalResult.push(result[i]);
    }
  }
  return res.status(200).json({ result: finalResult });
});

// Chart 3: Api to get count of all participant over time
app.get("/getParticipantsCount", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  const result = [
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
  for (let i = 0; i < result.length; i++) {
    if (result[i].id >= fromDate && result[i].id <= toDate) {
      console.log();
      finalResult.push(result[i]);
    }
  }
  return res.status(200).json({ result: finalResult });
});

// Chart 4:  Api to get count of all retros over time
app.get("/getRetrosCount", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  const result = [
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
  for (let i = 0; i < result.length; i++) {
    if (result[i].id >= fromDate && result[i].id <= toDate) {
      console.log();
      finalResult.push(result[i]);
    }
  }

  return res.status(200).json({ result: finalResult });
});

// Chart 7: Api to get Enterprise Level Sentiments Moods
app.get("/getEnterpriseLevelSentimentsMoods", async (req, res) => {
  let finalResult = [];
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  const result = [
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
  for (let i = 0; i < result.length; i++) {
    if (result[i].id >= fromDate && result[i].id <= toDate) {
      finalResult.push(result[i]);
    }
  }
  return res.status(200).json({ result: finalResult });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
