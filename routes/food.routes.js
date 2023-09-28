const express = require('express');
const { getFoodForUser, createFoodForUser, deleteUserFood } = require('../controllers/food.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @desc : Get user's food
// @route : GET /api/v1/food
// @access : Private
router.get('/', protect, async (req, res, next) => {
  try{
    const food = await getFoodForUser(req.user.id);

    res.status(200).json({
      success: true,
      data: food
    });
  }catch(error){
    next(error);
  }
});

// @desc : Create a Food for user
// @route : POST /api/v1/food
// @access : Private
router.post('/', protect, async (req, res, next) => {
  try{
    const food = await createFoodForUser(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: food
    });
  }catch(error){
    next(error);
  }
});

// @desc : Delete a user's food
// @route : DELETE /api/v1/food/:foodId
// @access : Private
router.delete('/:foodId', protect, async (req, res, next) => {
  try{
    await deleteUserFood(req.user.id, req.params.foodId);

    res.status(204).json({
      success: true,
      data: {}
    });
  }catch(error){
    next(error);
  }
});

module.exports = router;