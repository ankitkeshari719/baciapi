const express = require("express");
const router = express.Router();
const roleService = require("../services/role.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/create", create);
router.post("/update/:roleId", update);
router.get("/", getAll);
router.get("/:roleId", getById);
router.delete("/:roleId", _delete);

module.exports = router;

function create(req, res, next) {
  roleService
    .create(req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Role created successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role creations FAILED!" + " " + err,
      })
    );
}

function getAll(req, res, next) {
  roleService
    .getAll()
    .then((roles) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Roles fetched successfully!",
        data: roles,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Roles fetched FAILED!" + " " + err,
      })
    );
}

function getById(req, res, next) {
  roleService
    .getById(req.params.roleId)
    .then((role) =>
      role
        ? res.json({
            status: STATUS.SUCCESS,
            message: "Role fetched successfully!",
            data: role,
          })
        : res.json({
            status: STATUS.SUCCESS,
            message: "Role not found!",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role fetched FAILED!" + " " + err,
      })
    );
}

function update(req, res, next) {
  roleService
    .update(req.params.roleId, req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Role updated successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role update FAILED!" + " " + err,
      })
    );
}

function _delete(req, res, next) {
  roleService
    .delete(req.params.roleId)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Role deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role delete FAILED!" + " " + err,
      })
    );
}
