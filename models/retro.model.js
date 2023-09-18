const mongoose = require("mongoose");

const facilitatorModel={id:String,name:String,avatar:String, userType:Number}

const retroModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    humanId: {
      type: String,
      required: true,
    },
    joinUrl: {
      type: String,
      required: true,
    },
    creatorId: {
        type: String,
    },
    timestamp: {
      type: Number
    },
    retroStatus:{ type: String,},
    waitingTimeStamp:{},
    teamId:{ type: String,},
    enterpriseId:{ type: String,},
    facilitatorId:{type:facilitatorModel},
    retroDate:{type:Number},
    retroSummary:{type:String},
    isActive:{type:Boolean},
    action:{  type: Array,
        },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Retro", retroModel);
