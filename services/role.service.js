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
  const roleId =
    roleParam.roleName.toString().replace(" ", "_").toLowerCase() +
    Math.random();
  // validate
  if (await Role.findOne({ roleName: roleParam.roleName })) {
    throw "Role name " + roleParam.roleName + " is already taken";
  }

  const requested_data = {
    roleId: roleId,
    roleName: roleParam.roleName,
    isActive: roleParam.isActive,
  };

  const role = new Role(requested_data);

  // save role
  await role.save();
  return roleId;
}

async function getAll() {
  return await Role.find();
}

async function getById(roleId) {
  const role = await Role.findOne({ roleId: roleId });
  return role;
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
  return role;
}

async function _delete(roleId) {
  const role = await Role.findOne({ roleId: roleId });

  // validate
  if (!role) throw "Role not found";

  await Role.deleteMany({ roleId: roleId });
}
