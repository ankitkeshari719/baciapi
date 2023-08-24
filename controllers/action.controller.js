const express = require("express");
const router = express.Router();
const actionService = require("../services/action.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/create", create);
router.post("/update/:actionId", update);
router.get("/", getAll);
router.get("/:actionId", getById);
router.delete("/:actionId", _delete);

module.exports = router;

function create(req, res, next) {
  actionService
    .create(req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Action created successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Action creations FAILED!" + " " + err,
      })
    );
}

function getAll(req, res, next) {
  actionService
    .getAll()
    .then((actions) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Actions fetched successfully!",
        data: actions,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Actions fetched FAILED!" + " " + err,
      })
    );
}

function getById(req, res, next) {
  actionService
    .getById(req.params.actionId)
    .then((action) =>
      action
        ? res.json({
            status: STATUS.SUCCESS,
            message: "Action fetched successfully!",
            data: action,
          })
        : res.json({
            status: STATUS.SUCCESS,
            message: "Action not found!",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Action fetched FAILED!" + " " + err,
      })
    );
}

function update(req, res, next) {
  actionService
    .update(req.params.actionId, req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Action updated successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Action update FAILED!" + " " + err,
      })
    );
}

function _delete(req, res, next) {
  actionService
    .delete(req.params.actionId)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Action deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Action delete FAILED!" + " " + err,
      })
    );
}
