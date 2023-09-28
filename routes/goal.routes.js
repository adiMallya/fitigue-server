const express = require('express');
const { getUserGoals, createGoalForUser, deleteUserGoal, updateGoalStatus } = require('../controllers/goal.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @desc : Get user's goals
// @route : GET /api/v1/goals
// @access : Private
router.get('/', protect, async (req, res, next) => {
  try{
    const goals = await getUserGoals(req.user.id);

    res.status(200).json({
      success: true,
      data: goals
    });
  }catch(error){
    next(error);
  }
});

// @desc : Create a Goal for user
// @route : POST /api/v1/goals
// @access : Private
router.post('/', protect, async (req, res, next) => {
  try{
    const goals = await createGoalForUser(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: goals
    });
  }catch(error){
    next(error);
  }
});

// @desc : Delete a user's goal
// @route : DELETE /api/v1/goals/:goalId
// @access : Private
router.delete('/:goalId', protect, async (req, res, next) => {
  try{
    await deleteUserGoal(req.user.id, req.params.goalId);

    res.status(204).json({
      success: true,
      data: {}
    });
  }catch(error){
    next(error);
  }
});

// @desc : Update a user's goal status
// @route : POST /api/v1/goals/:goalId
// @access : Private
router.post('/:goalId', protect, async (req, res, next) => {
  try{
    const goal = await updateGoalStatus(req.user.id, req.params.goalId, req.query.status);

    res.status(200).json({
      success: true,
      data: goal
    });
  }catch(error){
    next(error);
  }
});

module.exports = router;