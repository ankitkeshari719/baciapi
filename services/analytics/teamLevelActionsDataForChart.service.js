
const db = require("../../_helpers/db");
const usersDB = db.User;
const teamsDB = db.Team;
const actionsDB = db.Action;
const { JIRA_STATUS,ROLE_NAME } = require("../../_helpers/const");
async function getTeamLevelActionsDataForChart(req){
    const id = req.body.userId;
    const roleName = req.body.roleName;
    const enterpriseId = req.body.enterpriseId;
    const teamId = req.body.teamId;
    let timestamp1 = new Date(req.body.fromDate).getTime();
    let timestamp2 = new Date(req.body.toDate).getTime();
  
  
  var queryForActions="";
  
  if(teamId=="0")
  {if(roleName==ROLE_NAME.ENTERPRISE_ADMIN){
    queryForActions={
      enterpriseId: enterpriseId,
      createdAt: { $gte: timestamp1, $lte: timestamp2 },
    }
  }
  else{
    const user = await usersDB.find({ emailId: id });
    const teamIds = user && user[0]?user[0].teams :[];
    if(teamIds==[]){
    return {
        actionsData: teamActionsData,
      }
    }
    queryForActions={
      enterpriseId: enterpriseId,
      createdAt: { $gte: timestamp1, $lte: timestamp2 },
      teamId: { $in: teamIds }
    }
  }}
  else{
  
    
      queryForActions={
        enterpriseId: enterpriseId,
        createdAt: { $gte: timestamp1, $lte: timestamp2 },
        teamId:  teamId 
      
    }
  }
  const teamsData = await teamsDB
  .find({
    enterpriseId:enterpriseId
  })
  ;

  
    const j = await actionsDB
      .find(queryForActions)
    
  
    var result = j.reduce((acc, elem) => {
      isPresent = acc.findIndex((k) => k.actionId == elem.actionId);
      if (isPresent == -1) {
        acc.push(elem);
      } else {
        if (new Date(acc[isPresent].updatedAt) < new Date(elem.updatedAt))
          acc[isPresent] = elem;
      }
      return acc;
    }, []);
  
    // Create a dictionary to store grouped elements
    const groupedData = {};
  
    // Iterate through the array and group elements by "id"
    result.forEach((item) => {
      const { teamId } = item;
  
      // Check if the "id" already exists in the groupedData dictionary
      if (!groupedData[teamId]) {
        groupedData[teamId] = [];
      }
  
      // Add the current item to the corresponding group
      groupedData[teamId].push(item);
    });
  
    // Convert the grouped data into an array of arrays
    const result1 = Object.values(groupedData);
    let teamActionsData = [];
    result1.forEach((teamData) => {
      const teamObj = {
        teamId: "",
        teamName: "",
        completed: 0,
        pending: 0,
        completedInPer: 0,
        actions: teamData,
      };
  
   
  
      teamData.forEach((jiraAction) => {
        teamObj.teamId = jiraAction.teamId;
        if (jiraAction.status == JIRA_STATUS.DONE) {
          teamObj.completed = teamObj.completed + 1;
        } else {
          teamObj.pending = teamObj.pending + 1;
        }
      });
  
  
      teamsData.forEach((element) => {
        if (element.teamId == teamObj.teamId) {
          teamObj.teamName = element.teamName;
          teamId
        }
      });
  
  
      teamObj.completedInPer =
        ( (teamObj.completed/teamObj.actions.length) * 100) 
          ? ((teamObj.completed/teamObj.actions.length) * 100) 
          : 0;

      teamActionsData.push(teamObj);
    });
  
    return teamActionsData;

}

module.exports={
    getTeamLevelActionsDataForChart
}