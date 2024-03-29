const ErrorResponse = require('../utils/errorResponse');

// @desc: handle any error responses not taken care by defined routes
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  // Log to console for dev
  console.log(err.stack);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  //Token expiry
  if(err.name === "TokenExpiredError"){
    const message = "Token expired"
    error = new ErrorResponse(message, 401);
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });

};

module.exports = errorHandler;