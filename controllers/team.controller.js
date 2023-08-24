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
router.get("/getAllTeamsByEnterpriseId/:enterpriseId", getAllTeamsByEnterpriseId);

module.exports = router;

function create(req, res, next) {
  teamService
    .create(req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Team created successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team creations FAILED!" + " " + err,
      })
    );
}

function update(req, res, next) {
  teamService
    .update(req.params.teamId, req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Team updated successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team updation FAILED!" + " " + err,
      })
    );
}

function getAll(req, res, next) {
  teamService
    .getAll()
    .then((teams) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Teams fetched successfully!",
        data: teams,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Teams fetched FAILED!" + " " + err,
      })
    );
}

function getById(req, res, next) {
  teamService
    .getById(req.params.id)
    .then((team) =>
      team
        ? res.json({
            status: STATUS.SUCCESS,
            message: "Team fetched successfully!",
            data: team,
          })
        : res.sendStatus(404)
    )
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  teamService
    .delete(req.params.teamId)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Team deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Team delete FAILED!" + " " + err,
      })
    );
}

function getAllTeamsByEnterpriseId(req, res, next) {
  teamService
    .getAllTeamsByEnterpriseId(req.params.enterpriseId)
    .then((teams) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Teams fetched successfully!",
        data: teams,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Teams fetched FAILED!" + " " + err,
      })
    );
}
