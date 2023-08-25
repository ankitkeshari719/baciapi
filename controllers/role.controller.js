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
    .then((roleId) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Role created successfully!",
        data: roleId,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAll(req, res, next) {
  roleService
    .getAll()
    .then((roles) =>
      rres.status(200).json({
        status: STATUS.SUCCESS,
        message: "Roles fetched successfully!",
        data: roles,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Roles fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getById(req, res, next) {
  roleService
    .getById(req.params.roleId)
    .then((role) =>
      role
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Role fetched successfully!",
            data: role,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Role not found!",
            data: "Role not found",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function update(req, res, next) {
  roleService
    .update(req.params.roleId, req.body)
    .then((role) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Role updated successfully!",
        data: role,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role update FAILED!" + " " + err,
        data: err,
      })
    );
}

function _delete(req, res, next) {
  roleService
    .delete(req.params.roleId)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Role deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Role delete FAILED!" + " " + err,
        data: err,
      })
    );
}
