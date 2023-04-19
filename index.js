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

const db = client.db(`bacidb`);
const collection = db.collection("retros");

//openAI
const { Configuration, OpenAIApi } = require("azure-openai");
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
  // let retroId=req.body.retroId;
  // let action= req.body.action;
  // const query = { _id: retroId};
  // const update = { $push: {action:{
  //     ...action,
  //     timestamp: Date.now(),
  //     sourceActionTimestamp: action.sourceActionTimestamp,
  //     //sourceActionTimestamp: Date.now(),
  // } }};
  // const options = {upsert: true};
  // const result = await collection.findOneAndUpdate(query, update);
  // action.timestamp = Date.now();
  // console.log(`upsertResult1: ${JSON.stringify(result.value?._id)}\n`);
  // Socket.emit("newMessage",retroId, [{
  //     action: action,
  //     retroId: retroId
  //   }]);
  try {
    const jsonString1 = JSON.stringify(whatWentWell, null, 2);
    const combinedString1 = `Please automatically categorise the phrases in the array into a new JSON array with the categories grouped into less than 6 groups\n\n${jsonString1}, please return it in the form of array`;
    const completion = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [{ role: "user", content: combinedString1 }],
    });
    return res.status(200).json({
      response: JSON.parse(completion.data.choices[0].message.content),
    });
  } catch (error) {
    console.error(error);
    return res.status(200).json(error);
  }
});

// const {  OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: "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",
// });

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
  // let retroId=req.body.retroId;
  // let action= req.body.action;
  // const query = { _id: retroId};
  // const update = { $push: {action:{
  //     ...action,
  //     timestamp: Date.now(),
  //     sourceActionTimestamp: action.sourceActionTimestamp,
  //     //sourceActionTimestamp: Date.now(),
  // } }};
  // const options = {upsert: true};
  // const result = await collection.findOneAndUpdate(query, update);
  // action.timestamp = Date.now();
  // console.log(`upsertResult1: ${JSON.stringify(result.value?._id)}\n`);
  // Socket.emit("newMessage",retroId, [{
  //     action: action,
  //     retroId: retroId
  //   }]);

  try {
    const data = [];
    let inputColumn = req.body.column;
    inputColumn.forEach((element) => {
      data.push(element.value);
    });

    console.log(data);

    const jsonString1 = JSON.stringify(data, null, 2);
//      const combinedString1 = `Please dont return sentimental grouping. Please automatically categorise the phrases in the array into a new JSON array with the categories grouped into less than 6 groups \n\n${jsonString1}.
//     The responst must be like [{category:"xyz",sentences["one","other"]}]. If you could not process or error then please provide with baciError300 only don't add other data
//     . The sentences are present in array \n\n${jsonString1}. Please don't consider if the sentences array is empty while returning drop that object`;
    const combinedString1 = `Please dont return sentimental grouping. Move the sentences to the less than 6 group depending on their meaning, context  and other factors also allocate the name to group, max cards per group are 10. Then convert the response to json array.
The responst must be like [{category:"xyz",sentences["one","other"]}]. If you could not process or error then please provide with baciError300 only don't add other data
. The sentences are present in array \n\n${jsonString1}. Please don't consider if the sentences array is empty while returning drop that object`;

    const completion = await openai.createChatCompletion({
      model: "prod-baci-chat",
      messages: [{ role: "user", content: combinedString1 }],
    });
    //     const completion = getAiResponse(`Please move the sentences to the group depending on their meaning, context also allocate the name to group. Then convert the response to json array.
    // The responst must be like [{category:"xyz",sentences["one","other"]}]. If you could not process or error then please provide with baciError300 only don't add other data
    // . The sentences are present in array \n\n${jsonString1}`);

    //console.log(completion);

    console.log(
      completion.data.choices[0].message.content,
      completion.data.choices[0].message.content.includes("baciError300")
    );

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
            if (inputData.value == sentence) {
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
    console.error(error);
    return res.status(200).json(error);
  }
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log("Listening on port " + port);
});

module.exports = app;
