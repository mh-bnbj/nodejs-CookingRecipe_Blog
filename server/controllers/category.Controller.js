const mongoose = require('mongoose')
const Category = require('../models/Category.Model')
const Recipe = require('../models/Recipe.Model')
const User = require('../models/User.Model')

exports.exploreCategoies = async (req, res) => {
    try {
        const limitNumber = 20
        const categories = await Category.find({}).limit(limitNumber)

        res.render('categories', {
            title: 'Cooking Blog - categories',
            categories: categories,
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.submitCategory = async (req, res) => {
    try {
        res.render('submit-category', {
            title: 'Cooking Blog - Submit',
            infoErrorObj: req.flash('infoErrors'),
            infoSubmitObj: req.flash('infoSubmit'),
            loginState: typeof req.cookies['jwt-token'] === 'undefined',
        })
    } catch (err) {
        res.status(500).send({ message: err.message || 'Error Occured' })
    }
}

exports.submitCategoryOnPost = async (req, res) => {
    try {
        let imageUploadFile
        let uploadPath
        let newImageName

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('No Files where uploaded . ')
        } else {
            imageUploadFile = req.files.image

            newImageName = Date.now() + '_' + imageUploadFile.name

            uploadPath =
                require('path').resolve('./') +
                '/public/uploads/category/' +
                newImageName

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err)
            })
        }

        const newCategory = new Category({
            name: req.body.name,
            image: newImageName,
        })

        await newCategory.save()

        req.flash('infoSubmit', 'Category has been added.')
        res.redirect('/submit-category')
    } catch (err) {
        req.flash('infoErrors', 'Error : ' + err.massage)
        res.redirect('/submit-category')
    }
}
