const express = require('express');
const { getExercisesForUser, createExerciseForUser, deleteUserExercise } = require('../controllers/exercise.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @desc : Get user's exercises
// @route : GET /api/v1/exercises
// @access : Private
router.get('/', protect, async (req, res, next) => {
  try{
    const exercises = await getExercisesForUser(req.user.id);

    res.status(200).json({
      success: true,
      data: exercises
    });
  }catch(error){
    next(error);
  }
});

// @desc : Create an exercise for user
// @route : POST /api/v1/exercises
// @access : Private
router.post('/', protect, async (req, res, next) => {
  try{
    const exercises = await createExerciseForUser(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: exercises
    });
  }catch(error){
    next(error);
  }
});

// @desc : Delete a user's exercise
// @route : DELETE /api/v1/exercises/:exerciseId
// @access : Private
router.delete('/:exerciseId', protect, async (req, res, next) => {
  try{
    await deleteUserExercise(req.user.id, req.params.exerciseId);

    res.status(204).json({
      success: true,
      data: {}
    });
  }catch(error){
    next(error);
  }
});

module.exports = router;