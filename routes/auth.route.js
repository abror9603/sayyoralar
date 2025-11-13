const {Router} = require('express')
const {register, login, getProfile, updateDetails, updatePassword} = require('../controllers/auth.controller') 
const {protected} = require('../middlewares/auth')
const router = Router()

// Sign up
router.post('/register', register)
// Sign in
router.post('/login', login)
// Get profile
router.get('/profile', protected, getProfile)
// Update details
router.put('/update', protected, updateDetails)
// Update password
router.put('/update-password', protected, updatePassword)
module.exports = router