const ErrorResponse = require('../utils/errorResponse');
const Goal = require('../models/Goal');
const User = require('../models/User');

exports.getUserGoals = async (userId) => {
  try{
    return await Goal.find({ user: userId }).sort({ updatedAt: -1});
  }catch(error){
    throw error;
  }
}

exports.createGoalForUser = async (userId, goalData) => {
  try{
    const goal = new Goal({ ...goalData, user: userId });
    const newGoal = await goal.save();

    //Update total calorie goal for the user
    await User.updateOne(
      { _id: userId },
      { $inc: { totalCalorieGoal : newGoal.targetCalories } }
    );

    return await Goal.find({ user: userId }).sort({ updatedAt: -1});
  }catch(error){
    throw error;
  }
}

exports.deleteUserGoal = async (userId, goalId) => {
  try{
    const goal = await Goal.findById(goalId);

    if(!goal){
      throw new ErrorResponse(`Goal not found with the id of ${goalId}`, 400);
    }

    if(goal.user.toString() !== userId){
      throw new ErrorResponse(`User ${userId} is not authorized to delete this goal`, 401);  
    }
    
    goal.deleteOne();

    //Update total calorie goal for the user(decrement)
    await User.updateOne(
      { _id: goal.user },
      { $inc: { totalCalorieGoal : -goal.targetCalories } }
    );
  }catch(error){
    throw error;
  }
}

exports.updateGoalStatus = async (userId, goalId, status) => {
  try{
    const goal = await Goal.findByIdAndUpdate(goalId, { status }, {
      new: true,
      runValidators: true
    });

    if(status === 'Abandoned'){
     //Update total calorie goal for the user(decrement)
      await User.updateOne(
        { _id: goal.user },
        { $inc: { totalCalorieGoal : -goal.targetCalories } }
      ); 
    }

    return await Goal.find({ user: userId }).sort({ updatedAt: -1});
  }catch(error){
    throw error;
  }
}