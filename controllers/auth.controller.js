const User = require("../models/user.models");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const uuid = require("uuid");


// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const apiKey = uuid.v4();

  const user = await User.create({
    name,
    email,
    password,
    apiKey,
  });

  const token = user.generateJwtToken()

  res.status(201).json({
    success: true,
    data: user,
    token
  });
});


// @desc    Login old user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body

  // Validate email and password

  if(!email || !password){
    return next(new ErrorResponse("Pleace provide email and password", 400))
  }

  const user = await User.findOne({email})
  
  // Check for user

  if(!user){
    return next(new ErrorResponse("Invalid Credentials", 401))
  }

  // Check for password

  const isMatch = await user.checkPassword(password)

  if(!isMatch){
    return next(new ErrorResponse("Invalid Credentials", 401))
  }

  const token = user.generateJwtToken()


  res.status(200).json({
    success: true,
    data: user,
    token
  })
}) 


// @desc Get profile
// @route GET /api/v1/auth/profile
// @access Private

exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  res.status(200).json({
    success: true,
    data: user
  })
})

// @desc Update details
// @route PUT /api/v1/auth/update
// @access Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id)

    const updateDetails = {
      name: req.body.name || user.name,
      email: req.body.email || user.email
    }

    const updateUser = await User.findByIdAndUpdate(user._id, updateDetails, {new: true, runValidators: true})

    

    res.status(201).json({
      success: true,
      data: updateUser,
    
    })
})

// @desc Update password
// @route PUT /api/v1/auth/update-password
// @access Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)

  if(!(await user.checkPassword(req.body.currentPassword))){
    return next(new ErrorResponse("Old password is incorrect", 400))
  }

  user.password = req.body.newPassword
  await user.save()

  const token = user.generateJwtToken()

    res.status(201).json({
      success: true,
      data: user,
      token
    })
})
