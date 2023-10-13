const mongoose = require("mongoose");

const facilitatorModel = {
  id: String,
  name: String,
  avatar: String,
  userType: Number,
};

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
    retroGoal: {
      type: String,
    },
    retroTimeframe: {
      type: String,
    },
    selectedTemplate: {
      type: Object,
    },
    selectedPulseCheck: {
      type: Object,
    },
    userName: {
      type: String,
    },
    selectedAvatar: {
      type: String,
    },
    userType: {
      type: Number,
    },
    selectedTeam: {
      type: String,
    },
    selectedFacilitator: {
      type: String,
    },
    scheduleRetroType: {
      type: String,
    },
    scheduleRetroTime: {
      type: String,
    },
    scheduleDescription: {
      type: String,
    },
    isLoginUser: {
      type: Boolean,
    },
    retroSummary: { type: String },
    enterpriseId: { type: String },
    action: { type: Array },
    creatorId: {
      type: String,
    },
    timestamp: {
      type: Number,
    },
    retroStatus: { type: String },
    waitingTimeStamp: {},
    retroDate: { type: Number },
    isActive: { type: Boolean },
    emotionsAsPerCategory: { type: Array },
    retroEmotions: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Retro", retroModel);
