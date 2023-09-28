const ErrorResponse = require('../utils/errorResponse');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

exports.getExercisesForUser = async (userId) => {
  try{
    return await Exercise.find({ user: userId });
  }catch(error){
    throw error;
  }
}

exports.createExerciseForUser = async (userId, exerciseData) => {
  try{
    const exercise = new Exercise({ ...exerciseData, user: userId });
    const newExercise = await exercise.save();

    //Update total calorie burned for the user
    await User.updateOne(
      { _id: userId },
      { $inc: { totalCaloriesBurned : newExercise.calories } }
    );

    return await Exercise.find({ user: userId });;
  }catch(error){
    throw error;
  }
}

exports.deleteUserExercise = async (userId, exerciseId) => {
  try{
    const exercise = await Exercise.findById(exerciseId);

    if(!exercise){
      throw new ErrorResponse(`Exercise not found with the id of ${exerciseId}`, 400);
    }

    if(exercise.user.toString() !== userId){
      throw new ErrorResponse(`User ${userId} is not authorized to delete this exercise`, 401);  
    }
    
    exercise.deleteOne();

    //Update total calorie burned for the user(decrement)
    await User.updateOne(
      { _id: exercise.user },
      { $inc: { totalCaloriesBurned : -exercise.calories } }
    );
  }catch(error){
    throw error;
  }
}