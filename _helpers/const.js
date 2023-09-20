const STATUS = {
  SUCCESS: "Success",
  FAILED: "Failed",
};

const JIRA_STATUS = {
  TODO: "TODO",
  INPROGRESS: "IN-PROGRESS",
  DONE: "DONE",
};

const ROLE_NAME={
ENTERPRISE_ADMIN:  "Enterprise",
REGULAR_ENTERPRISE:"Basic",
REGULAR_USER:"Regular User"
}
const QUICK_PULSE_CHECK_QUESTIONS = [
  "1. People & Resources ",
  "2. Work Processes ",
  "3. Technical Tools ",
];
const RETRO_STATUS = {
  WAITING: "waiting",
  STARTED: "started",
  ENDED: "ended",
};


const EMOTIONS_PER_CATEGORY=[
  {groupName:"Individual and Team Goals",happyCards:[],neutralCards:[],sadCards:[]},
  {groupName:"People and Resources",happyCards:[],neutralCards:[],sadCards:[]},
 {groupName: "Team Structure and Capabilities",happyCards:[],neutralCards:[],sadCards:[]},
{ groupName: "Decision Making (Individual and Team)",happyCards:[],neutralCards:[],sadCards:[]},
{  groupName: "Openness to Feedback & Test and Learn",happyCards:[],neutralCards:[],sadCards:[]},
{ groupName: "Work Prioritisation",happyCards:[],neutralCards:[],sadCards:[]},
{ groupName: "Work Technology and Tools",happyCards:[],neutralCards:[],sadCards:[]}
]

module.exports = {
  STATUS,
  JIRA_STATUS,
  ROLE_NAME,
  QUICK_PULSE_CHECK_QUESTIONS,
  RETRO_STATUS,
  EMOTIONS_PER_CATEGORY
};
