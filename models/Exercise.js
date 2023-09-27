const fs = require('fs');
const mongoose = require('mongoose');
//Read data from file
const exerciseCalories = JSON.parse(fs.readFileSync('././_data/MET.json', 'utf-8'));

const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: [true, "Exercise must have a duration set in minutes."],
    min: 1,
    default: 60
  },
  calories: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

//Auto calculate calories burned
ExerciseSchema.pre('save', async function (next) {
  // Fetch user
  const user = await mongoose.model('User').findById(this.user);

  // Fetch MET value for the given exercise type
  const MET = exerciseCalories[this.name.toLowerCase()];

  if(MET){
    this.calories = this.duration * ((MET * 3.5 * user.weight) / 200);
  }

  next();
});

module.exports = mongoose.model('Exercise', ExerciseSchema);