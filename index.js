const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const bodyParser = require("body-parser");
const config = require('./config.json');
require('dotenv').config();
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;
const { MongoClient, ObjectId , Logger } = require('mongodb');
const http = require("http");
const { io } = require("./utils/socket");
const { Socket } = require("./utils/socket");


const BearerStrategy = require('passport-azure-ad').BearerStrategy;
const url = process.env.COSMOS_CONNECTION_STRING;
const client = new MongoClient(url);


const db = client.db(`bacidb`);
const collection = db.collection('retros');

const options = {
    identityMetadata: `https://${config.metadata.b2cDomain}/${config.credentials.tenantName}/${config.policies.policyName}/${config.metadata.version}/${config.metadata.discovery}`,
    clientID: config.credentials.clientID,
    audience: config.credentials.clientID,
    policyName: config.policies.policyName,
    isB2C: config.settings.isB2C,
    validateIssuer: config.settings.validateIssuer,
    loggingLevel: config.settings.loggingLevel,
    passReqToCallback: config.settings.passReqToCallback,
    scope: config.protectedRoutes.hello.scopes
}

const bearerStrategy = new BearerStrategy(options, (token, done) => {
        // Send user info using the second argument
        done(null, { }, token);
    }
);

const app = express();

app.use(morgan('dev'));

app.use(passport.initialize());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(express.urlencoded())

passport.use(bearerStrategy);

const server = http.createServer(app);

io.attach(server);
//enable CORS (for testing only -remove in production/deployment)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// exposed API endpoint

app.get('/hello',
    passport.authenticate('oauth-bearer', {session: false}),
    (req, res) => {
        console.log('Validated claims: ', req.authInfo);

        // Service relies on the name claim.  
        res.status(200).json({
            'name': req.authInfo['name'],
            'issued-by': req.authInfo['iss'],
            'issued-for': req.authInfo['aud'],
            'scope': req.authInfo['scp']
        });
    }
);
app.post('/createRetro', async (req,res) =>{
    let retro=req.body.retro;
    let creator= req.body.creator;
    console.log("serverTimestamp",Date.now())
    const result = await collection.insertOne( {
        ...retro,
        creatorId: creator.id,
        timestamp: Date.now()
    });
    return res.status(200).json({id:result.insertedId});

});
app.post('/addRetroAction', async (req,res) =>{
    let retroId=req.body.retroId;
    let action= req.body.action;
    const query = { _id: retroId};
    const update = { $push: {action:{
        ...action,
        timestamp: Date.now(),
        sourceActionTimestamp: action.sourceActionTimestamp,
        //sourceActionTimestamp: Date.now(),
    } }};
    const options = {upsert: true};
    const result = await collection.findOneAndUpdate(query, update);
    action.timestamp = Date.now();
    console.log(`upsertResult1: ${JSON.stringify(result.value?._id)}\n`);
    Socket.emit("newMessage",retroId, [{
        action: action,
        retroId: retroId
      }]);
    return res.status(200).json({id:result.value?._id});

});

app.get('/getRetro', async (req,res) =>{
    let id=req.query.id;
    const result = await collection.find( { "_id":ObjectId(id) }).toArray();
    console.log(result);
    return res.status(200).json({retro:result});
});
app.get('/getRetroByHumanId', async (req,res) =>{
    let id=req.query.id;
    const result = await collection.find( { "humanId":id }).toArray();
    console.log(result);
    return res.status(200).json({retro:result});
});
app.get('/getRetroActions', async (req,res) =>{
    let id=req.query.id;
    let userId=req.query.userId;
    let fromTimestamp=req.query.fromTimestamp;
    let ts=fromTimestamp === undefined ? 0 : parseInt(fromTimestamp)
    console.log(ts);
    const result = await collection.find(
        {
            $and: [
              {
                _id: ObjectId(id)
              },
              {
                "action.sourceActionTimestamp" : {$gt: ts}
              }
            ]
          }
    )
    .project({
        _id:0,
        action:1,
    }).toArray();
    console.log(result);
    return res.status(200).json({retro:result});
});


app.post('/addFeedback', async (req,res) =>{
    let retroId=req.body.retroId;
    let user= req.body.user;
    let rating= req.body.rating;
    let comment = req.body.comment;

    console.log("serverTimestamp",Date.now())
    const result = await db.collection('feedback').insertOne( 
        { retroId, userId: user.id, rating, comment, timestamp: Date.now() }
    );
    return res.status(200).json({id:result.insertedId});

});
const port = process.env.PORT || 5010;

server.listen(port, () => {
    console.log('Listening on port ' + port);
});

module.exports = app;