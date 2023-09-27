const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  targetDate: {
    type: Date,
    required: [true, "Please add a target date"]
  },
  targetCalories: {
    type: Number,
    required: [true, "Please add targeting calories"]
  },
  status: {
    type: String,
    enum: ["In Progress", "Acheived", "Abandoned"],
    default: "In Progress"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', GoalSchema);