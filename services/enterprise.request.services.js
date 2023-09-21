const db = require("../_helpers/db");
const EnterpriseRequest = db.EnterpriseRequest;

module.exports = {
  create,
  getAllByEnterpriseId,
  getByEnterpriseRequestId,
  update,
  delete: _delete,
};

async function create(enterpriseRequestParam) {
  const enterpriseRequestId =
    enterpriseRequestParam.fromName.toString().replace(" ", "_").toLowerCase() +
    Math.random();

  const requested_data = {
    enterpriseRequestId: enterpriseRequestId,
    organisationId: enterpriseRequestParam.organisationId,
    fromName: enterpriseRequestParam.fromName,
    fromEmail: enterpriseRequestParam.fromEmail,
    fromTeams: enterpriseRequestParam.fromTeams,
    toEmails: enterpriseRequestParam.toEmails,
    isApproved: enterpriseRequestParam.isApproved,
  };
  const enterpriseRequest = new EnterpriseRequest(requested_data);

  // save enterpriseRequest
  await enterpriseRequest.save();
  return requested_data;
}

async function getAllByEnterpriseId(organisationId) {
  const enterpriseRequests = await EnterpriseRequest.aggregate([
    {
      $match: {
        organisationId: organisationId,
        isApproved: false,
      },
    },
    {
      $unwind: {
        path: "$team",
        preserveNullAndEmptyArrays: true, // Preserve empty arrays
      },
    },
    {
      $lookup: {
        from: "teams", // Name of the teams collection
        localField: "fromTeams",
        foreignField: "teamId",
        as: "teamInfo",
      },
    },
    {
      $group: {
        _id: "$_id",
        enterpriseRequest: { $first: "$$ROOT" },
      },
    },
  ]);

  return enterpriseRequests;
}

async function getByEnterpriseRequestId(enterpriseRequestId) {
  const enterpriseRequests = await EnterpriseRequest.findOne({
    enterpriseRequestId: enterpriseRequestId,
  });
  return enterpriseRequests;
}

async function update(enterpriseRequestId, enterpriseRequestParam) {
  const enterpriseRequest = await EnterpriseRequest.findOne({
    enterpriseRequestId: enterpriseRequestId,
  });

  // validate
  if (!enterpriseRequest) throw "EnterpriseRequest not found";

  // copy enterpriseRequestParam properties to enterpriseRequest
  Object.assign(enterpriseRequest, enterpriseRequestParam);

  await enterpriseRequest.save();
  return enterpriseRequest;
}

async function _delete(enterpriseRequestId) {
  const enterpriseRequest = await EnterpriseRequest.findOne({
    enterpriseRequestId: enterpriseRequestId,
  });

  // validate
  if (!enterpriseRequest) throw "EnterpriseRequest not found";

  await EnterpriseRequest.deleteMany({
    enterpriseRequestId: enterpriseRequestId,
  });
}
