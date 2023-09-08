const express = require("express");
const router = express.Router();
const enterpriseService = require("../services/enterprise.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/create", create);
router.post("/update/:organisationId", update);
router.get("/", getAll);
router.get("/:organisationId", getById);
router.delete("/:organisationId", _delete);

module.exports = router;

function create(req, res, next) {
  enterpriseService
    .create(req.body)
    .then((organisationId) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise created successfully!",
        data: organisationId,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAll(req, res, next) {
  enterpriseService
    .getAll()
    .then((enterprises) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprises fetched successfully!",
        data: enterprises,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprises fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getById(req, res, next) {
  enterpriseService
    .getById(req.params.organisationId)
    .then((enterprise) =>
      enterprise
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Enterprise fetched successfully!",
            data: enterprise,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Enterprise not found!",
            data: '"Enterprise not found!"',
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function update(req, res, next) {
  enterpriseService
    .update(req.params.organisationId, req.body)
    .then((enterprise) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise updated successfully!",
        data: enterprise,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise update FAILED!" + " " + err,
        data: err,
      })
    );
}

function _delete(req, res, next) {
  enterpriseService
    .delete(req.params.organisationId)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise delete FAILED!" + " " + err,
        data: err,
      })
    );
}
