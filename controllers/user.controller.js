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
router.get("/:userId", getById);
router.get("/:emailId", getByEmail);
router.delete("/:userId", _delete);
router.get("/getAllUsersByEnterpriseId/:enterpriseId", getAllUsersByEnterpriseId);

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json({
            status: STATUS.SUCCESS,
            message: "User authenticated successfully!",
            data: user,
          })
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

function create(req, res, next) {
  userService
    .create(req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "User created successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User creations FAILED!" + " " + err,
      })
    );
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Users fetched successfully!",
        data: users,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Users fetched FAILED!" + " " + err,
      })
    );
}

function getAllByEmails(req, res, next) {
  userService
    .getAllByEmails(req.body)
    .then((users) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Users fetched successfully!",
        data: users,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Users fetched FAILED!" + " " + err,
      })
    );
}

function getById(req, res, next) {
  userService
    .getById(req.params.userId)
    .then((user) =>
      user
        ? res.json({
            status: STATUS.SUCCESS,
            message: "User fetched successfully!",
            data: user,
          })
        : res.json({
            status: STATUS.SUCCESS,
            message: "User not found!",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User fetched FAILED!" + " " + err,
      })
    );
}

function getByEmail(req, res, next) {
  userService
    .getByEmail(req.params.emailId)
    .then((user) =>
      user
        ? res.json({
            status: STATUS.SUCCESS,
            message: "User fetched successfully!",
            data: user,
          })
        : res.json({
            status: STATUS.SUCCESS,
            message: "User not found!",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User fetched FAILED!" + " " + err,
      })
    );
}

function update(req, res, next) {
  userService
    .update(req.params.emailId, req.body)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "User updated successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User update FAILED!" + " " + err,
      })
    );
}

function _delete(req, res, next) {
  userService
    .delete(req.params.userId)
    .then(() =>
      res.json({
        status: STATUS.SUCCESS,
        message: "User deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "User delete FAILED!" + " " + err,
      })
    );
}

function getAllUsersByEnterpriseId(req, res, next) {
  userService
    .getAllUsersByEnterpriseId(req.params.enterpriseId)
    .then((users) =>
      res.json({
        status: STATUS.SUCCESS,
        message: "Users fetched successfully!",
        data: users,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Users fetched FAILED!" + " " + err,
      })
    );
}
