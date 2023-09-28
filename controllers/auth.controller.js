const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.signUp = async (userDetail) => {
  try {
    const userExists = await User.findOne({ username: userDetail.username });

    if(userExists){
      throw new ErrorResponse(`Username ${userDetail.username} already taken.`, 400)
    }

    const user = new User(userDetail);
    const newUser = await user.save();
    
    return newUser;
  } catch (error) {
    throw error;
  }
}

exports.login = async (email, password) => {
  try {
    if (!email || !password) {
        throw new ErrorResponse('Please provide an email and password');
    }

    //Check user
    const user = await User.findOne({ email });    
    if(!user){
      throw new ErrorResponse('Invalid credentials', 401);
    }

    //Check password
    const matched = await user.matchPassword(password);

    if(!matched){
      throw new ErrorResponse('Invalid credentials', 401);
    }

    return user;
  } catch (error) {
    throw error;
  }
}

exports.getMe = async (userId) => {
  try {
     const user = await User.findById(userId);
  
    if(!user){
      throw new ErrorResponse('Not Authorized.', 401);
    }

    return user; 
  }  catch(error){
    throw error;
  }
}

exports.updateDetails = async (userId, fieldsToUpdate) => {
  try {
    const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
  
    if(!user){
      throw new ErrorResponse('Not Authorized.', 401);
    }
  
    return user; 
  } catch(error){
    throw error;
  }
}
// Fetch token from model and send response
exports.sendTokenResponse = (user, statusCode, res) => {
    // Create JWT token
    const token = user.getSignedJwtToken();

    res
      .status(statusCode)
      .json({
          success: true,
          token
      });
}