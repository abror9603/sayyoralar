const {Router} = require('express')
const router = Router()
const {getAllStars, getStarById, createNewStars, updateStar, deleteStar} = require('../controllers/star.controller')
const { upload, handleMulterError } = require('../utils/fileUpload');
const {protected, adminAccess, checkApiKey} = require('../middlewares/auth')
// get all stars
router.get('/', checkApiKey, getAllStars)

// get one star
router.get('/:id', checkApiKey, getStarById)

// create new stars
router.post('/', protected, adminAccess, upload.single('image'), createNewStars)

// update star
router.put('/:id', protected, adminAccess, updateStar)

// delete star
router.delete('/:id', protected, adminAccess, deleteStar)

module.exports = router