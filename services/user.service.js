const db = require("../_helpers/db");
const User = db.User;
const Team = db.Team;
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
  deleteMany: _deleteMany,
  deactivateMultipleByIds,
  checkUserExistOrNot,
  updateRoleOnEnterpriseRequest,
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
    firstName: userParam.firstName,
    lastName: userParam.lastName,
    emailId: userParam.emailId,
    phoneNo: userParam.phoneNo,
    name: userParam.name,
    country: userParam.country,
    cityCode: userParam.cityCode,
    plan: userParam.plan,
    roleId: userParam.roleId,
    roleName: userParam.roleName,
    enterpriseId: userParam.enterpriseId,
    enterpriseName: userParam.enterpriseName,
    selectedAvatar: userParam.selectedAvatar,
    isEnterpriserRequested: userParam.isEnterpriserRequested,
    teams: userParam.teams,
    isActive: userParam.isActive,
    enterpriseRequestId: userParam.enterpriseRequestId,
  };
  const user = new User(requested_data);

  // save user
  await user.save();

  return user;
}

async function getAll() {
  return await User.find();
}

async function checkUserExistOrNot(emailId) {
  return await User.findOne({ emailId: emailId });
}

async function getByEmail(emailId) {
  const teamIds = await User.findOne({ emailId: emailId }).then(
    (userData) => userData.teams
  );
  const teams = await Team.find({ teamId: { $in: teamIds } });
  const user = await User.findOne({ emailId: emailId }).then((userData) => {
    userData.teams = teams;
    return userData;
  });
  return user;
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

  const teamIds = await User.findOne({ emailId: emailId }).then(
    (userData) => userData.teams
  );
  const teams = await Team.find({ teamId: { $in: teamIds } });
  const sentUsers = await User.findOne({ emailId: emailId }).then(
    (userData) => {
      userData.teams = teams;
      return userData;
    }
  );
  return sentUsers;
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
  return await user;
}

async function getAllUsersByEnterpriseId(enterpriseId) {
  const users = await User.aggregate([
    {
      $match: {
        enterpriseId: enterpriseId,
        isActive: true,
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
        localField: "teams",
        foreignField: "teamId",
        as: "teamInfo",
      },
    },
    {
      $addFields: {
        team: {
          $cond: {
            if: { $eq: [{ $size: "$teamInfo" }, 0] },
            then: [],
            else: {
              $map: {
                input: "$teamInfo",
                as: "teamData",
                in: "$$teamData",
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$$ROOT" },
      },
    },
  ]);
  return users;
}

async function _deleteMany(userParam) {
  await User.deleteMany({ emailId: userParam.emailIds });
}

async function deactivateMultipleByIds(userParam) {
  await User.updateMany(
    { emailId: { $in: userParam.emailIds } },
    { $set: { isActive: false } },
    { multi: true }
  );
}

async function updateRoleOnEnterpriseRequest(userParam) {
  await User.updateMany(
    { emailId: { $in: userParam.emailIds } },
    {
      $set: {
        roleId: userParam.roleId,
        roleName: userParam.roleName,
        isEnterpriserRequested: userParam.isEnterpriserRequested,
      },
    },
    { multi: true }
  );
}
