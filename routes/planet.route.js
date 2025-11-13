const {Router} = require('express')
const router = Router()
const {getAllPlanets, createNewPlanet, getPlanetById, updatePlanetById, deletePlanet} = require('../controllers/planet.controller')
const { upload, handleMulterError } = require('../utils/fileUpload');
const {protected, adminAccess, checkApiKey} = require('../middlewares/auth')
// get all planets route
router.get('/', checkApiKey, getAllPlanets)

// get planet by id route
router.get('/:id', checkApiKey, getPlanetById)

// create new palnet route
router.post('/', protected, adminAccess, upload.array('images', 5), // maksimum 5 ta rasm
    handleMulterError,
    createNewPlanet)


// router.post('/planets', 
//     upload.fields([
//         { name: 'image', maxCount: 1 },
//         { name: 'gallery', maxCount: 5 }
//     ]),
//     handleMulterError,
//     createNewPlanet
// );

// update planet
router.put('/:id', 
    protected,
    adminAccess,
    upload.single('image'), 
    handleMulterError,
    updatePlanetById)

// delete planet
router.delete('/:id', protected, adminAccess, deletePlanet)

module.exports = router