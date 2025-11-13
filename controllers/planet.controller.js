const Planet = require('../models/planet.models')
const Star = require('../models/star.models')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const fs = require('fs')

// @desc Get all planets
// @route /api/v1/planets
// @access Public / with apiKey

exports.getAllPlanets = asyncHandler(async (req, res, next) => {
    const planets = await Planet.find().populate('star')

    res.status(200).json({
        success: true,
        data: planets
    })
})

// @desc Create new planet
// @route /api/v1/planets
// @access Private/Admin

exports.createNewPlanet = asyncHandler(async (req, res, next) => {
    const star = await Star.findOne({name: req.body.star})
    const newPlanet = await Planet.create({
        name: req.body.name,
        distanceToStar: req.body.distanceToStar,
        diametr: req.body.diametr,
        yearDuration: req.body.yearDuration,
        dayDuration: req.body.dayDuration,
        temprature: req.body.temprature,
        sequenceNumber: req.body.sequenceNumber,
        satellites: req.body.satellites,
        image: 'uploads/' + req.file.filename,
        star: star._id
    })

    await Star.findByIdAndUpdate(star._id, {...star, planets: newPlanet._id}, {new:true, upsert:true})

    res.status(201).json({
        success: true,
        data: newPlanet
    })
})


// @desc Get one planet by id
// @route /api/v1/planets/:id
// @access Public / with apiKey

exports.getPlanetById = asyncHandler(async (req, res, next) => {
    const planet = await Planet.findById(req.params.id).populate('star')

    res.status(200).json({
        success:true,
        data: planet
    })
})


// @desc Update planet
// @route /api/v1/planets/:id
// @access Private/Admin

exports.updatePlanetById = asyncHandler(async (req, res, next) => {
    const star = await Star.findOne({name: req.body.star})
    const planet = await Planet.findById(req.params.id);
    
    if (!planet) {
        // Agar fayl yuklangan bo'lsa, uni o'chirish
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
            success: false,
            message: 'Planet topilmadi'
        });
    }

    const newPlanetData = {
        name: req.body.name || planet.name,
        distanceToStar: req.body.distanceToStar || planet.distanceToStar,
        diametr: req.body.diametr || planet.diametr,
        yearDuration: req.body.yearDuration || planet.yearDuration,
        dayDuration: req.body.dayDuration || planet.dayDuration,
        temprature: req.body.temprature || planet.temprature,
        sequenceNumber: req.body.sequenceNumber || planet.sequenceNumber,
        satellites: req.body.satellites || planet.satellites,
        star: star._id
    };

    // Agar yangi fayl yuklangan bo'lsa
    if (req.file) {
        // Eski faylni o'chirish
        if (planet.image) {
            const oldImagePath = path.join(__dirname, '..', 'public', planet.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }
        newPlanetData.image = 'uploads/' + req.file.filename;
    }

    const updatePlanet = await Planet.findByIdAndUpdate(
        req.params.id, 
        newPlanetData, 
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: updatePlanet
    });
});


// @desc Delete planet
// @route /api/v1/planets/:id
// @access Private/Admin

exports.deletePlanet = asyncHandler(async (req, res, next) => {
    await Planet.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Deleted successfully!"
    })
})