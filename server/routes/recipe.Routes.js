const express = require('express')
const router = express.Router()

const recipeController = require('../controllers/recipe.Controller')
const categoryController = require('../controllers/category.Controller')
const authController = require('../controllers/authenticate.Controller')

const passport = require('passport')

router.get('/test', recipeController.test)

router.get('/', recipeController.homepage)
router.get('/recipe/:id', recipeController.exploreRecipe)

router.get('/categories', categoryController.exploreCategoies)
router.get('/categories/:id', recipeController.exploreCategoieById)

router.get('/search', recipeController.searchRecipe)

router.get('/explore-latest', recipeController.exploreLatest)

router.get('/random-recipe', recipeController.exploreRandom)

router.get(
    '/submit-recipe',
    authController.checkUser,
    recipeController.submitRecipe
)
router.post(
    '/submit-recipe',
    authController.checkUser,
    recipeController.submitRecipeOnPost
)

router.get(
    '/submit-category',
    authController.checkAdmin,
    categoryController.submitCategory
)
router.post(
    '/submit-category',
    authController.checkAdmin,
    categoryController.submitCategoryOnPost
)

router.get('/login', authController.login.get)
router.post('/login', authController.login.post)

router.get('/signup', authController.signup.get)
router.post('/signup', authController.signup.post)

router.get('/logout', authController.logout)

module.exports = router
