const express = require('express');
const { body } = require('express-validator');
const {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getRecipeStats
} = require('../controllers/recipeController');

const router = express.Router();

// Validation middleware
const recipeValidation = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 200 })
        .withMessage('Title cannot exceed 200 characters'),
    body('ingredients')
        .isArray({ min: 1 })
        .withMessage('At least one ingredient is required'),
    body('instructions')
        .isArray({ min: 1 })
        .withMessage('At least one instruction is required'),
    body('prep_time')
        .isInt({ min: 0 })
        .withMessage('Prep time must be a non-negative integer'),
    body('cook_time')
        .isInt({ min: 0 })
        .withMessage('Cook time must be a non-negative integer'),
    body('servings')
        .isInt({ min: 1, max: 50 })
        .withMessage('Servings must be between 1 and 50'),
    body('difficulty_level')
        .isIn(['Easy', 'Medium', 'Hard'])
        .withMessage('Difficulty must be Easy, Medium, or Hard')
];

// Routes
router.post('/', recipeValidation, createRecipe);
router.get('/', getAllRecipes);
router.get('/stats', getRecipeStats);
router.get('/:id', getRecipeById);
router.put('/:id', recipeValidation, updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;