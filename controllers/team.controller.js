const express = require("express");
const router = express.Router();
const teamService = require("../services/team.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/create", create);
router.post("/update/:teamId", update);
router.get("/", getAll);
router.get("/:id", getById);
router.delete("/:teamId", _delete);
router.get(
  "/getAllTeamsByEnterpriseId/:enterpriseId",
  getAllTeamsByEnterpriseId
);

module.exports = router;

function create(req, res, next) {
  teamService
    .create(req.body)
    .then((teamId) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Team created successfully!",
        data: teamId,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function update(req, res, next) {
  teamService
    .update(req.params.teamId, req.body)
    .then((team) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Team updated successfully!",
        data: team,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team updation FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAll(req, res, next) {
  teamService
    .getAll()
    .then((teams) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Teams fetched successfully!",
        data: teams,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Teams fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getById(req, res, next) {
  teamService
    .getById(req.params.id)
    .then((team) =>
      team
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Team fetched successfully!",
            data: team,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Team not found!",
            data: "Team not Found!",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team fetched FAILED!" + " " + err,
        data: null,
      })
    );
}

function _delete(req, res, next) {
  teamService
    .delete(req.params.teamId)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Team deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team delete FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAllTeamsByEnterpriseId(req, res, next) {
  teamService
    .getAllTeamsByEnterpriseId(req.params.enterpriseId)
    .then((teams) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Teams fetched successfully!",
        data: teams,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Teams fetched FAILED!" + " " + err,
        data: err,
      })
    );
}
