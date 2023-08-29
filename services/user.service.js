const db = require("../_helpers/db");
const User = db.User;
const bcrypt = require("bcryptjs");

module.exports = {
  authenticate,
  create,
  getAll,
  getAllByEmails,
  getByEmail,
  update,
  delete: _delete,
  getAllUsersByEnterpriseId,
};

async function authenticate(userParam) {
  const user = await User.findOne({ emailId: userParam.emailId });
  if (user && bcrypt.compareSync(userParam.password, user.password)) {
    return {
      ...user.toJSON(),
    };
  }
}

async function create(userParam) {
  // validate
  if (await User.findOne({ emailId: userParam.emailId })) {
    throw "User emailId " + userParam.emailId + " is already taken";
  }
  const requested_data = {
    emailId: userParam.emailId,
    firstName: userParam.firstName,
    lastName: userParam.lastName,
    phoneNo: userParam.phoneNo,
    name: userParam.name,
    cityCode: userParam.cityCode,
    country: userParam.country,
    companyName: userParam.companyName,
    role: userParam.role,
    team: userParam.team,
    plan: userParam.plan,
    enterpriseId: userParam.enterpriseId,
    roleId: userParam.roleId,
    roleName: userParam.roleName,
    enterpriseName: userParam.enterpriseName,
    isActive: userParam.isActive,
  };

  const user = new User(requested_data);

  // save user
  await user.save();

  return user;
}

async function getAll() {
  return await User.find();
}

async function getByEmail(emailId) {
  return await User.findOne({ emailId: emailId });
}

async function update(emailId, userParam) {
  const user = await User.findOne({ emailId: emailId });

  // validate
  if (!user) throw "User not found";
  if (
    user.emailId !== userParam.emailId &&
    (await User.findOne({ emailId: userParam.emailId }))
  ) {
    throw "User email id " + userParam.emailId + " is already taken";
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
  return user;
}

async function _delete(emailId) {
  const user = await User.findOne({ emailId: emailId });

  // validate
  if (!user) throw "User not found";

  await User.deleteMany({ emailId: emailId });
}

async function getAllByEmails(userParam) {
  let user = [];
  for (let i = 0; i < userParam.emails.length; i++) {
    const tempUser = await User.findOne({ emailId: userParam.emails[i] });
    user.push(tempUser);
  }

  console.log("user::", user);

  return await user;
}

async function getAllUsersByEnterpriseId(enterpriseId) {
  return await User.find({ enterpriseId: enterpriseId });
}
