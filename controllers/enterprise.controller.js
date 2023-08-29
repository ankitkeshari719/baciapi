const express = require("express");
const router = express.Router();
const enterpriseService = require("../services/enterprise.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/create", create);
router.post("/update/:enterpriseId", update);
router.get("/", getAll);
router.get("/:enterpriseId", getById);
router.delete("/:enterpriseId", _delete);

module.exports = router;

function create(req, res, next) {
  enterpriseService
    .create(req.body)
    .then((enterpriseId) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise created successfully!",
        data: enterpriseId,
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
    .getById(req.params.enterpriseId)
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
    .update(req.params.enterpriseId, req.body)
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
    .delete(req.params.enterpriseId)
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
