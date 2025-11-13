const Star = require('../models/star.models');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// @desc  Get all Stars
// @route  GET /api/v1/stars
// @access Public / with apiKey

exports.getAllStars = asyncHandler(async (req, res, next) => {
    const stars = await Star.find().populate('planets')

    res.status(200).json({
        success: true,
        data: stars
    })
})

// @desc Create new Star
// @route POST /api/v1/stars
// @access Private/Admin

exports.createNewStars  = asyncHandler(async(req, res, next) =>{
    const newStar = await Star.create({
        name: req.body.name,
        massa: req.body.massa,
        diametr: req.body.diametr,
        temprature: req.body.temprature,
        image: "uploads/" + req.file.filename
    })

    res.status(200).json({
        success: true,
        data: newStar
    })
})


// @desc Get one Star by ID
// @route GET /api/v1/stars/:id
// @access Public / with apiKey

exports.getStarById = asyncHandler(async ( req, res, next) => {
    const star = await Star.findById(req.params.id).populate('planets')

    res.status(200).json({
        success: true,
        data: star
    })
})



// @desc  Update star 
// @route PUT /api/v1/stars/:id
// @access Private/Admin

exports.updateStar = asyncHandler(async (req, res, next) => {
    const star = await Star.findById(req.params.id)

    const reqBodyData = {
        name: req.body.name || star.name,
        massa: req.body.massa || star.massa,
        diametr: req.body.diametr || star.diametr,
        temprature: req.body.temprature || star.temprature,
    }

    const editStar = await Star.findByIdAndUpdate(req.params.id, reqBodyData, {new: true})

    res.status(200).json({
        success: true,
        data: editStar
    })
})


// @desc Delete star
// @route DELETE /api/v1/stars/:id
// @access Private/Admin

exports.deleteStar = asyncHandler(async ( req, res, next) => {
    await Star.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
        success: true,
        message: "Deleted successfully"
    })
})