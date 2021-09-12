const express = require('express')
const router = express.Router(); //to create routes
const checkAuth = require('../auth/check-auth')

//controller
const UserController = require('../controllers/users')

//creating new user

router.post('/signup', UserController.user_signup)


//login
router.post('/login', UserController.user_login);


//delete user route
router.delete('/:userId', checkAuth, UserController.delete_user)



module.exports = router;