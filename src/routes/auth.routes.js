const {Router} = require("express")
const authController = require("../controller/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")

const authRouter = Router()

// Register 

/**
 * @route POST api/auth/register
 * @description register a new user 
 * @access Public 
 */
authRouter.post("/register",authController.registerUserController)

// Login

/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access Public
 */
authRouter.post('/login', authController.LoginUserController)

// Logout 

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blackList 
 * @acess Public 
 */
authRouter.get("/logout", authController.LogoutuserController)

/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)


module.exports = authRouter


