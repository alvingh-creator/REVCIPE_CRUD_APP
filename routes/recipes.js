// routes/recipes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/recipeController');

// POST /api/recipes
router.post('/', controller.createRecipe);

// GET /api/recipes
router.get('/', controller.getAllRecipes);

// GET /api/recipes/:id
router.get('/:id', controller.getRecipeById);

// PUT /api/recipes/:id
router.put('/:id', controller.updateRecipe);

// DELETE /api/recipes/:id
router.delete('/:id', controller.deleteRecipe);

module.exports = router;