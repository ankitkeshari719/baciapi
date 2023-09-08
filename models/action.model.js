const mongoose = require("mongoose");

const actionModel = mongoose.Schema(
  {

    actionId: {
      type: String,
    },
    actionName: {
      type: String,
      required: true,
    },
    jiraId: {
      type: String,
    },
    retroId: {
      type: String,
      required: true,
    },
    retroIdEnc:{
      type:String,
      required:true,
    },
    teamId: {
      type: String,
    },
    assignedTo: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    // There will be only four status
    // "TO DO" , "IN-PROGRESS" , "DONE" , "CANCELLED"
    status: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    //It will be usefull for filter
    enterpriseId:{
      type:String,
      required:true
    },
    jiraUrl:{
      type:String
    },

  },
  {
    timestamps: true,
  }
  
);

module.exports = mongoose.model("Action", actionModel);
