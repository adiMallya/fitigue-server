const express = require('express');
const { signUp, login, sendTokenResponse, getMe, updateDetails } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @desc : User sign-up
// @route : POST /api/v1/auth/signup
// @access : Public
router.post('/signup', async (req, res, next) => {
  try {
    const user = await signUp(req.body);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
})


// @desc : Login user
// @route : POST /api/v1/auth/login
// @access : Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await login(email, password);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
})

// @desc : Get current user
// @route : GET /api/v1/auth/me
// @access : Protected
router.get('/me', protect, async (req, res, next) => {
  try{
    const user = await getMe(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  }catch(error){
    next(error);
  }
});

// @desc : Update current user details
// @route : POST /api/v1/auth/updateDetails
// @access : Protected
router.post('/updateDetails', protect, async (req, res, next) => {
  try{
    const user = await updateDetails(req.user.id, req.body);

    res.status(200).json({
      success: true,
      data: user
    });
  }catch(error){
    next(error);
  }
});

module.exports = router;