const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  calories: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    require: [true, "Enter carbohydrates(in grams)"]
  },
  proteins: {
    type: Number,
    require: [true, "Enter proteins(in grams)"]
  },
  fats: {
    type: Number,
    require: [true, "Enter fats(in grams)"]
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

//Calculate calories consumed
FoodSchema.pre('save', function (next) {
  this.calories = (this.proteins * 4) + (this.carbs * 4) + (this.fats * 9)
  
  next();
});

module.exports = mongoose.model('Food', FoodSchema);