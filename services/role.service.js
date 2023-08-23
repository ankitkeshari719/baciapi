const db = require("../_helpers/db");
const Role = db.Role;

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function create(roleParam) {
  // validate
  if (await Role.findOne({ roleName: roleParam.roleName })) {
    throw "Role name " + roleParam.roleName + " is already taken";
  }

  const requested_data = {
    roleId: roleParam.roleName.toString().toLowerCase(),
    roleName: roleParam.roleName,
    isActive: roleParam.isActive,
  };

  const role = new Role(requested_data);

  // save role
  await role.save();
}

async function getAll() {
  return await Role.find();
}

async function getById(roleId) {
  return await Role.findOne({ roleId: roleId });
}

async function update(roleId, roleParam) {
  const role = await Role.findOne({ roleId: roleId });

  // validate
  if (!role) throw "Role not found";
  if (
    role.roleName !== roleParam.roleName &&
    (await Role.findOne({ roleName: roleParam.roleName }))
  ) {
    throw "Role name " + roleParam.roleName + " is already taken";
  }

  // copy roleParam properties to role
  Object.assign(role, roleParam);

  await role.save();
}

async function _delete(roleId) {
  const role = await Role.findOne({ roleId: roleId });

  // validate
  if (!role) throw "Role not found";

  await Role.deleteMany({ roleId: roleId });
}
