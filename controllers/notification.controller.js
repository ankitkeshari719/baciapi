const express = require("express");
const router = express.Router();
const notificationService = require("../services/notification.service");
const { STATUS } = require("../_helpers/const");

// routes
router.post("/create", create);
router.post("/update/:notificationId", update);
router.get("/", getAll);
router.get("/:notificationId", getById);
router.delete("/:notificationId", _delete);
router.post(
  "/addEnterpriseRequestNotification",
  _addEnterpriseRequestNotification
);
router.post("/getAllValidNotification/", _getAllValidNotification);
router.post("/markAllNotificationById", _markAllNotificationById);

module.exports = router;

function getAll(req, res, next) {
  notificationService
    .getAll()
    .then((notifications) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notification fetched successfully!",
        data: notifications,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getById(req, res, next) {
  notificationService
    .getById(req.params.notificationId)
    .then((notification) =>
      notification
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Notification fetched successfully!",
            data: notification,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Notification not found!",
            data: "Notification not found",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function create(req, res, next) {
  notificationService
    .create(req.body)
    .then((notificationId) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notification created successfully!",
        data: notificationId,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function update(req, res, next) {
  notificationService
    .update(req.params.notificationId, req.body)
    .then((notification) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notification updated successfully!",
        data: notification,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification update FAILED!" + " " + err,
        data: err,
      })
    );
}

function _delete(req, res, next) {
  notificationService
    .delete(req.params.notificationId)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notification deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification delete FAILED!" + " " + err,
        data: err,
      })
    );
}

function _addEnterpriseRequestNotification(req, res, next) {
  notificationService
    .addEnterpriseRequestNotification(req.body)
    .then((notificationId) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notification created successfully!",
        data: notificationId,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function _getAllValidNotification(req, res, next) {
  notificationService
    .getAllValidNotification(req.body)
    .then((notifications) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notification fetched successfully!",
        data: notifications,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notification fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function _markAllNotificationById(req, res, next) {
  notificationService
    .markAllNotificationById(req.body)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Notifications updated!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Notifications updated FAILED!" + " " + err,
        data: err,
      })
    );
}
