const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    ingredients: {
        type: Array,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'Category',
    },
})

recipeSchema.index({ name: 'text', description: 'text' })

module.exports = mongoose.model('Recipe', recipeSchema, 'Recipe')
