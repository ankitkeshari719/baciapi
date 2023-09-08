const express = require("express");
const router = express.Router();
const analyticsService = require("../services/analytics.service");
const { STATUS,JIRA_STATUS } = require("../_helpers/const");


// routes
router.post("/getTeamLevelActionsDataForChart", getTeamLevelActionsDataForChart);

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