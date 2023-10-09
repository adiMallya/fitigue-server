const ErrorResponse = require('../utils/errorResponse');
const Food = require('../models/Food');
const User = require('../models/User');

exports.getFoodForUser = async (userId) => {
  try{
    return await Food.find({ user: userId }).sort({ updatedAt: -1});
  }catch(error){
    throw error;
  }
}

exports.createFoodForUser = async (userId, foodData) => {
  try{
    const food = new Food({ ...foodData, user: userId });
    const newFood = await food.save();

    //Update total calorie consumed for the user
    await User.updateOne(
      { _id: userId },
      { $inc: { totalCaloriesConsumed : newFood.calories } }
    );

    return await Food.find({ user: userId }).sort({ updatedAt: -1});
  }catch(error){
    throw error;
  }
}

exports.deleteUserFood = async (userId, foodId) => {
  try{
    const food = await Food.findById(foodId);

    if(!food){
      throw new ErrorResponse(`Food not found with the id of ${foodId}`, 400);
    }

    if(food.user.toString() !== userId){
      throw new ErrorResponse(`User ${userId} is not authorized to delete this food`, 401);  
    }
    
    food.deleteOne();

    //Update total calorie consumed for the user(decrement)
    await User.updateOne(
      { _id: food.user },
      { $inc: { totalCaloriesConsumed : -food.calories } }
    );
  }catch(error){
    throw error;
  }
}