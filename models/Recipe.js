const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    ingredient: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: String,
        required: true,
        trim: true
    }
});

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Recipe title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    ingredients: {
        type: [ingredientSchema],
        required: [true, 'At least one ingredient is required'],
        validate: [arrayLimit, 'At least one ingredient is required']
    },
    instructions: {
        type: [String],
        required: [true, 'At least one instruction is required'],
        validate: [arrayLimit, 'At least one instruction is required']
    },
    prep_time: {
        type: Number,
        required: [true, 'Preparation time is required'],
        min: [0, 'Preparation time cannot be negative']
    },
    cook_time: {
        type: Number,
        required: [true, 'Cooking time is required'],
        min: [0, 'Cooking time cannot be negative']
    },
    servings: {
        type: Number,
        required: [true, 'Number of servings is required'],
        min: [1, 'Servings must be at least 1'],
        max: [50, 'Servings cannot exceed 50']
    },
    difficulty_level: {
        type: String,
        required: [true, 'Difficulty level is required'],
        enum: {
            values: ['Easy', 'Medium', 'Hard'],
            message: 'Difficulty must be Easy, Medium, or Hard'
        }
    },
    cuisine_type: {
        type: String,
        trim: true,
        maxlength: [100, 'Cuisine type cannot exceed 100 characters']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field for total time
recipeSchema.virtual('total_time').get(function() {
    return this.prep_time + this.cook_time;
});

// Array validation function
function arrayLimit(val) {
    return val.length > 0;
}

// Index for search functionality
recipeSchema.index({ title: 'text', description: 'text', cuisine_type: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);