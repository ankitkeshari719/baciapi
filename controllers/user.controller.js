const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/authenticate", authenticate);
router.post("/create", create);
router.post("/update/:emailId", update);
router.get("/", getAll);
router.post("/", getAllByEmails);
router.get("/:emailId", getByEmail);
router.delete("/:userId", _delete);
router.get(
  "/getAllUsersByEnterpriseId/:enterpriseId",
  getAllUsersByEnterpriseId
);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "User authenticated successfully!",
            data: user,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Username or password is incorrect",
            data: "Username or password is incorrect",
          })
    )
    .catch((err) => next(err));
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then((user) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "User created successfully!",
        data: user,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Users fetched successfully!",
        data: users,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Users fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAllByEmails(req, res, next) {
  userService
    .getAllByEmails(req.body)
    .then((users) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Users fetched successfully!",
        data: users,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Users fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getByEmail(req, res, next) {
  userService
    .getByEmail(req.params.emailId)
    .then((user) =>
      user
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "User fetched successfully!",
            data: user,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "User not found!",
            data: null,
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function update(req, res, next) {
  userService
    .update(req.params.emailId, req.body)
    .then((user) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "User updated successfully!",
        data: user,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User update FAILED!" + " " + err,
        data: err,
      })
    );
}

function _delete(req, res, next) {
  userService
    .delete(req.params.userId)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "User deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User delete FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAllUsersByEnterpriseId(req, res, next) {
  userService
    .getAllUsersByEnterpriseId(req.params.enterpriseId)
    .then((users) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Users fetched successfully!",
        data: users,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Users fetched FAILED!" + " " + err,
        data: err,
      })
    );
}
