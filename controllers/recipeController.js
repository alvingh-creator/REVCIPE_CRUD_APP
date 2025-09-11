// controllers/recipeController.js
const Recipe = require('../models/Recipe');

// Create a recipe
exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    // ingredients may be sent as comma-separated string from frontend
    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === 'string' && ingredients.length > 0
      ? ingredients.split(',').map(i => i.trim())
      : [];

    const recipe = new Recipe({
      title,
      ingredients: ingredientsArray,
      instructions,
      time
    });

    const saved = await recipe.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json({ success: true, data: recipes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get recipe by id
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, data: recipe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Update recipe
exports.updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, time } = req.body;
    const ingredientsArray = Array.isArray(ingredients)
      ? ingredients
      : typeof ingredients === 'string' && ingredients.length > 0
      ? ingredients.split(',').map(i => i.trim())
      : [];

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients: ingredientsArray, instructions, time },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Recipe not found' });
    res.json({ success: true, message: 'Recipe deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};