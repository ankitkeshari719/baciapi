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

  // hash password
  let hashedPassword = null;
  if (userParam.password) {
    hashedPassword = bcrypt.hashSync(userParam.password, 10);
  }

  const requested_data = {
    emailId: userParam.emailId,
    password: hashedPassword,
    isActive: userParam.isActive,
    enterpriseId: userParam.enterpriseId,
    roleId: userParam.roleId,
  };

  const user = new User(requested_data);

  // save user
  await user.save();
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

  // hash password if it was entered
  if (userParam.password) {
    userParam.password = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function _delete(emailId) {
  const user = await User.findOne({ emailId: emailId });

  // validate
  if (!user) throw "User not found";

  await User.deleteMany({ emailId: emailId });
}

async function getAllByEmails(userParam) {
  console.log("emails::", userParam.emails);
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
