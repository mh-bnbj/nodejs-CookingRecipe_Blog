const mongoose = require('mongoose')
const Category = require('../models/Category.Model')
const Recipe = require('../models/Recipe.Model')
const User = require('../models/User.Model')

exports.test = async (req, res) => {
    try {
        let indexes = await Recipe.schema.indexes()
        res.send(indexes)
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.homepage = async (req, res) => {
    try {
        const limitNumber = 5
        const categories = await Category.find({}).limit(limitNumber)

        const latest = await Recipe.find({})
            .sort({ _id: -1 })
            .limit(limitNumber)

        const list = await Recipe.aggregate()
            .group({
                _id: '$category',
                count: { $sum: 1 },
            })
            .sort({ count: -1 })
            .limit(3)

        console.log('list : ', list)

        let popularCategory = []
        for (let item of list) {
            let recipes = await Recipe.find({ category: item._id })
                .sort({ _id: -1 })
                .limit(limitNumber)

            let category = await Category.findById(item._id)

            popularCategory.push({
                categoryName: category.name,
                categoryId: category._id,
                recipes: recipes,
            })
        }
        console.log('popularCategory : ', popularCategory)

        const recipes = { latest: latest, popularCategory: popularCategory }

        console.log(
            'loginState : ',
            typeof req.cookies['jwt-token'] === 'undefined'
        )
        res.render('index', {
            title: 'Cooking Blog - HomePage',
            categories: categories,
            recipes: recipes,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.exploreRecipe = async (req, res) => {
    try {
        let recipeId = req.params.id

        const recipe = await Recipe.findById(recipeId)
        const category = await Category.findById(recipe.category)

        res.render('recipe', {
            title: 'Cooking Blog - Recipe',
            recipe: recipe,
            category: category,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}
exports.exploreCategoieById = async (req, res) => {
    try {
        let categoryId = req.params.id

        const category = await Category.findById(categoryId)
        const recipes = await Recipe.find({ category: categoryId })

        res.render('categories', {
            title: 'Cooking Blog - categories',
            recipes: recipes,
            category: category,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.searchRecipe = async (req, res) => {
    try {
        let searchTerm = req.query.searchTerm

        const recipes = await Recipe.find({
            $text: { $search: searchTerm, $diacriticSensitive: true },
        })
        res.render('search', {
            title: 'Cooking Blog - search',
            recipes: recipes,
            searchTerm: searchTerm,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.exploreLatest = async (req, res) => {
    try {
        const limitNumber = 20
        const recipes = await Recipe.find({})
            .sort({ _id: -1 })
            .limit(limitNumber)

        res.render('explore-latest', {
            title: 'Cooking Blog - latest',
            recipes: recipes,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.exploreRandom = async (req, res) => {
    try {
        const count = await Recipe.find().countDocuments()

        let random = Math.floor(Math.random() * count)

        const recipe = await Recipe.findOne().skip(random).exec()
        const category = await Category.findById(recipe.category)
        res.render('recipe', {
            title: 'Cooking Blog - Random',
            recipe: recipe,
            category: category,
            RandomRecipe: true,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.submitRecipe = async (req, res) => {
    try {
        const categories = await Category.find()

        res.render('submit-recipe', {
            title: 'Cooking Blog - Submit',
            categories,
            infoErrorObj: req.flash('infoErrors'),
            infoSubmitObj: req.flash('infoSubmit'),
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.submitRecipeOnPost = async (req, res) => {
    try {
        let imageUploadFile
        let uploadPath
        let newImageName

        console.log('req.files : ', req)
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded . ')
        } else {
            imageUploadFile = req.files.image

            newImageName = Date.now() + '_' + imageUploadFile.name

            uploadPath =
                require('path').resolve('./') +
                '/public/uploads/' +
                newImageName

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err)
            })
        }

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName,
        })

        await newRecipe.save()

        req.flash('infoSubmit', 'Recipe has been added.')
        res.redirect('/submit-recipe')
    } catch (err) {
        req.flash('infoErrors', 'Error : ' + err.massage)
        res.redirect('/submit-recipe')
    }
}
