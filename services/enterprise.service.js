const db = require("../_helpers/db");
const Enterprise = db.Enterprise;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function create(enterpriseParam) {
  let organisationId =
    enterpriseParam.organisationName.toString().replace(" ", "_").toLowerCase() +
    Math.random();

  // validate
  const tempEnterprise = await Enterprise.findOne({
    organisationId: organisationId,
  });
  if (tempEnterprise) {
    organisationId =
      enterpriseParam.organisationName
        .toString()
        .replace(" ", "_")
        .toLowerCase() + Math.random();
  }

  const requested_data = {
    organisationId: organisationId,
    organisationPhoto: enterpriseParam.organisationPhoto,
    organisationName: enterpriseParam.organisationName,
    organisationDomain: enterpriseParam.organisationDomain,
    organisationCountry: enterpriseParam.organisationCountry,
    isActive: enterpriseParam.isActive,
  };

  const enterprise = new Enterprise(requested_data);

  // save enterprise
  await enterprise.save();
  return organisationId;
}

async function getAll() {
  return await Enterprise.find();
}

async function getById(organisationId) {
  return await Enterprise.findOne({ organisationId: organisationId });
}

async function update(organisationId, enterpriseParam) {
  const enterprise = await Enterprise.findOne({ organisationId: organisationId });

  // validate
  if (!enterprise) throw "Enterprise not found";

  // copy enterpriseParam properties to enterprise
  Object.assign(enterprise, enterpriseParam);

  await enterprise.save();
  return enterprise;
}

async function _delete(organisationId) {
  const enterprise = await Enterprise.findOne({ organisationId: organisationId });

  // validate
  if (!enterprise) throw "Enterprise not found";

  await Enterprise.deleteMany({ organisationId: organisationId });
}
