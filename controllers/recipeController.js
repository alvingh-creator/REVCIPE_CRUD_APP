const Recipe = require('../models/Recipe');
const { validationResult } = require('express-validator');

// Create a new recipe
const createRecipe = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const recipe = new Recipe(req.body);
        const savedRecipe = await recipe.save();
        
        res.status(201).json({
            success: true,
            message: 'Recipe created successfully',
            data: savedRecipe
        });
    } catch (error) {
        console.error('Create recipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating recipe',
            error: error.message
        });
    }
};

// Get all recipes with optional filtering and search
const getAllRecipes = async (req, res) => {
    try {
        const { search, cuisine, difficulty, page = 1, limit = 10 } = req.query;
        let query = {};

        // Search functionality
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { cuisine_type: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by cuisine
        if (cuisine) {
            query.cuisine_type = { $regex: cuisine, $options: 'i' };
        }

        // Filter by difficulty
        if (difficulty) {
            query.difficulty_level = difficulty;
        }

        const recipes = await Recipe.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Recipe.countDocuments(query);

        res.status(200).json({
            success: true,
            message: 'Recipes retrieved successfully',
            data: recipes,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecipes: total
            }
        });
    } catch (error) {
        console.error('Get recipes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving recipes',
            error: error.message
        });
    }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recipe retrieved successfully',
            data: recipe
        });
    } catch (error) {
        console.error('Get recipe by ID error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipe ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error retrieving recipe',
            error: error.message
        });
    }
};

// Update a recipe by ID
const updateRecipe = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recipe updated successfully',
            data: recipe
        });
    } catch (error) {
        console.error('Update recipe error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipe ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating recipe',
            error: error.message
        });
    }
};

// Delete a recipe by ID
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recipe deleted successfully',
            data: recipe
        });
    } catch (error) {
        console.error('Delete recipe error:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid recipe ID format'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error deleting recipe',
            error: error.message
        });
    }
};

// Get recipe statistics
const getRecipeStats = async (req, res) => {
    try {
        const totalRecipes = await Recipe.countDocuments();
        
        // Get difficulty distribution
        const difficultyStats = await Recipe.aggregate([
            { $group: { _id: '$difficulty_level', count: { $sum: 1 } } }
        ]);

        // Get top cuisines
        const cuisineStats = await Recipe.aggregate([
            { $match: { cuisine_type: { $ne: null, $ne: '' } } },
            { $group: { _id: '$cuisine_type', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            message: 'Recipe statistics retrieved successfully',
            data: {
                total_recipes: totalRecipes,
                by_difficulty: difficultyStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {}),
                top_cuisines: cuisineStats.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving statistics',
            error: error.message
        });
    }
};

module.exports = {
    createRecipe,
    getAllRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    getRecipeStats
};