// models/Recipe.js
const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String },
  ingredients: { type: [String], default: [] },
  instructions: { type: String },
  time: { type: Number }, // minutes
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);