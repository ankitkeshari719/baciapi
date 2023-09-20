const express = require("express");
const router = express.Router();
const analyticsService = require("../services/analytics/teamLevelActionsDataForChart.service");
const countOfAllPOverTime = require("../services/analytics/countOfAllPOverTime.service");
const countOfAllSessionsOverTime = require("../services/analytics/countOfAllSessionsOverTime.service");
const participantMoodCount =require("../services/analytics/participantMood.service")
const overAllSummary =require("../services/analytics/overallSummary.service")
const teamDataForTable =require("../services/analytics/teamDataForTable.service")
const emotionsAsPerCategory =require("../services/analytics/emotionsAsPerCategory.service")


const { STATUS,JIRA_STATUS } = require("../_helpers/const");


// routes
router.post("/getTeamLevelActionsDataForChart", getTeamLevelActionsDataForChart);

router.post("/getCountOfAllParticipantsOverTime",getCountOfAllParticipantsOverTime);
router.post("/getCountOfAllSessionsOverTime",getCountOfAllSessionsOverTime);
router.post("/getParticipantMoodCount",getParticipantMoodCount);
router.post("/getOverAllSummary",getOverAllSummary);
router.post("/getTeamDataForTable",getTeamDataForTable)
router.post("/getEmotionsAsPerCategory",getEmotionsAsPerCategory)



module.exports = router;
function getTeamLevelActionsDataForChart(req, res, next) {
    analyticsService
      .getTeamLevelActionsDataForChart(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Team level actions fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Team level actions fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }

  

  function getCountOfAllParticipantsOverTime(req, res, next) {
    countOfAllPOverTime
      .getCountOfAllParticipantsOverTime(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Participants data per month fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Participants data per month fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }


  function getCountOfAllSessionsOverTime(req, res, next) {
    countOfAllSessionsOverTime
      .getCountOfAllSessionsOverTime(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Sessions data per month fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Sessions data per month fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }

  
  function getParticipantMoodCount(req, res, next) {
    participantMoodCount
      .getParticipantMoodCount(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Participants mood count per month fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Participants mood count per month fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }

  function getOverAllSummary(req, res, next) {
    overAllSummary
      .getOverAllSummary(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Overall retro summary fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Overall retro summary fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }
  
  function getTeamDataForTable(req, res, next) {
    teamDataForTable
      .getTeamDataForTable(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Teams data for table fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Teams data for table fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }
  function getEmotionsAsPerCategory(req, res, next) {
    emotionsAsPerCategory
      .getEmotionsAsPerCategory(req)
      .then((action) =>
        res.status(200).json({
          status: STATUS.SUCCESS,
          message: "Emotions summary as per category fetched successfully!",
          data: action,
        })
      )
      .catch((err) =>
        res.json({
          status: STATUS.FAILED,
          message: "Emotions summary as per category fetched FAILED!" + " " + err,
          data: err,
        })
      );
  }