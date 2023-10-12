const fs = require('fs');
const mongoose = require('mongoose');
const connectDb = require('./config/db');

const User = require('./models/User');
const Exercise = require('./models/Exercise');
const Food = require('./models/Food');
const Goal = require('./models/Goal');

//Connect to DB
connectDb();

//Read data from files
const usersData = JSON.parse(fs.readFileSync('./_data/users.json', 'utf-8'));
const exercisesData = JSON.parse(fs.readFileSync('./_data/exercises.json', 'utf-8'));
const foodsData = JSON.parse(fs.readFileSync('./_data/foods.json', 'utf-8'));
const goalsData = JSON.parse(fs.readFileSync('./_data/goals.json', 'utf-8'));

//Import data
const importData = async () => {
  try {
    await User.create(usersData);

    for(let exe of exercisesData){
       const exercise = await Exercise.create(exe);

       await User.updateOne(
         { _id: exercise.user },
         { $inc: { totalCaloriesBurned: exercise.calories }}
       );
    }

    for(let foo of foodsData){
       const food = await Food.create(foo);

       await User.updateOne(
         { _id: food.user },
         { $inc: { totalCaloriesConsumed: food.calories }}
       );
    }

    for(let go of goalsData){
       const goal = await Goal.create(go);

       await User.updateOne(
         { _id: goal.user },
         { $inc: { totalCalorieGoal: goal.targetCalories }}
       );
    }
   
    console.log('Data imported...');
    process.exit();
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect()
  }
}
//Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Exercise.deleteMany();
    await Food.deleteMany();
    await Goal.deleteMany();

    console.log("Data destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect()
  }
}

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}