const express = require("express");
const router = express.Router();
const enterpriseRequestService = require("../services/enterprise.request.services");
const { STATUS } = require("../_helpers/const");
const { sendEmailsToUsers } = require("..");

// routes
router.post("/create", create);
router.post("/update/:enterpriseRequestId", update);
router.get("/:organisationId", getAllByEnterpriseId);
router.get("/:enterpriseRequestId", getByEnterpriseRequestId);
router.delete("/:enterpriseRequestId", _delete);
router.post(
  "/approvedDeclinedEnterpriseRequests",
  _approvedMultipleEnterpriseRequestByIds
);

module.exports = router;

function create(req, res, next) {
  enterpriseRequestService
    .create(req.body)
    .then( (enterpriseRequestId) =>

  
 { 
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise Requests created successfully!",
        data: enterpriseRequestId,
      })}
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise Requests creations FAILED!" + " " + err,
        data: err,
      })
    );
}

function getAllByEnterpriseId(req, res, next) {
  enterpriseRequestService
    .getAllByEnterpriseId(req.params.organisationId)
    .then((enterpriseRequests) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise Requests fetched successfully!",
        data: enterpriseRequests,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise Requests fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function getByEnterpriseRequestId(req, res, next) {
  enterpriseRequestService
    .getById(req.params.enterpriseRequestId)
    .then((enterpriseRequest) =>
      enterpriseRequest
        ? res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Enterprise Requests fetched successfully!",
            data: enterpriseRequest,
          })
        : res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Enterprise Requests not found!",
            data: "Enterprise Requests not found",
          })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise Requests fetched FAILED!" + " " + err,
        data: err,
      })
    );
}

function update(req, res, next) {
  enterpriseRequestService
    .update(req.params.enterpriseRequestId, req.body)
    .then((enterpriseRequest) =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise Requests updated successfully!",
        data: enterpriseRequest,
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise Requests update FAILED!" + " " + err,
        data: err,
      })
    );
}

function _delete(req, res, next) {
  enterpriseRequestService
    .delete(req.params.enterpriseRequestId)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise Requests deleted successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise Requests delete FAILED!" + " " + err,
        data: err,
      })
    );
}

function _approvedMultipleEnterpriseRequestByIds(req, res, next) {
  enterpriseRequestService
    .approvedMultipleEnterpriseRequestByIds(req.body)
    .then(() =>
      res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Enterprise Request Updated Successfully!",
      })
    )
    .catch((err) =>
      res.json({
        status: STATUS.FAILED,
        message: "Enterprise Request Updated FAILED!" + " " + err,
        data: err,
      })
    );
}
