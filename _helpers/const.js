const STATUS = {
  SUCCESS: "Success",
  FAILED: "Failed",
};

const JIRA_STATUS={
  TODO:"TODO",
  INPROGRESS:"IN-PROGRESS",
  DONE:"DONE"
}


const ROLE_NAME={
ENTERPRISE_ADMIN:  "Enterprise Admin",
REGULAR_ENTERPRISE:"Regular Enterprise",
REGULAR_USER:"Regular User"
}
const QUICK_PULSE_CHECK_QUESTIONS = [
  '1. People & Resources ',
  '2. Work Processes ',
  '3. Technical Tools ',
]
const RETRO_STATUS={
  WAITING:'waiting',
  STARTED:'started',
  ENDED:'ended'
}

module.exports = { STATUS,JIRA_STATUS,ROLE_NAME,QUICK_PULSE_CHECK_QUESTIONS,RETRO_STATUS };
