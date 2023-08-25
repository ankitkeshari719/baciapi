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
  let enterpriseId =
    enterpriseParam.enterpriseName.toString().replace(" ", "_").toLowerCase() +
    Math.random();

  // validate
  const tempEnterprise = await Enterprise.findOne({
    enterpriseId: enterpriseId,
  });
  if (tempEnterprise) {
    enterpriseId =
      enterpriseParam.enterpriseName
        .toString()
        .replace(" ", "_")
        .toLowerCase() + Math.random();
  }

  const requested_data = {
    enterpriseId: enterpriseId,
    enterpriseName: enterpriseParam.enterpriseName,
    enterpriseDomain: enterpriseParam.enterpriseDomain,
    enterpriseAddress: enterpriseParam.enterpriseAddress,
    isActive: enterpriseParam.isActive,
  };

  const enterprise = new Enterprise(requested_data);

  // save enterprise
  await enterprise.save();
  return enterpriseId;
}

async function getAll() {
  return await Enterprise.find();
}

async function getById(enterpriseId) {
  return await Enterprise.findOne({ enterpriseId: enterpriseId });
}

async function update(enterpriseId, enterpriseParam) {
  const enterprise = await Enterprise.findOne({ enterpriseId: enterpriseId });

  // validate
  if (!enterprise) throw "Enterprise not found";

  // copy enterpriseParam properties to enterprise
  Object.assign(enterprise, enterpriseParam);

  await enterprise.save();
  return enterprise;
}

async function _delete(enterpriseId) {
  const enterprise = await Enterprise.findOne({ enterpriseId: enterpriseId });

  // validate
  if (!enterprise) throw "Enterprise not found";

  await Enterprise.deleteMany({ enterpriseId: enterpriseId });
}
