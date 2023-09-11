const express = require("express");
const router = express.Router();
const analyticsService = require("../services/analytics/analytics.service");
const countOfAllPOverTime = require("../services/analytics/countOfAllPOverTime.service");
const { STATUS,JIRA_STATUS } = require("../_helpers/const");


// routes
router.post("/getTeamLevelActionsDataForChart", getTeamLevelActionsDataForChart);

router.post("/getCountOfAllParticipantsOverTime",getCountOfAllParticipantsOverTime);

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