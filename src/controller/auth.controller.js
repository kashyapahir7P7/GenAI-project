const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description register a new user, expects username,email and passoword in the request 
 * @access Public 
 */
async function registerUserController(req, res) {

    const{username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({
            message : "Please provide a username, email or password!"
        })
    }

    const isUseralredyExists = await userModel.findOne({
        $or: [{ username }, { email }]
    })
    
    if(isUseralredyExists){
        return res.status(400).json({
            message : "Account already exists with this email address or username!"
        })
    }

    // hash the password 
    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    // create the token
    const token = jwt.sign(
        {id: user._id, username: user.username},
         process.env.JWT_SECRET,
        {expiresIn : "1d" } 
    )

    // Set token in cookies
    res.cookie("token", token)

    res.status(201).json({
        message : "User registred successfully!",
        user : {
            id : user._id,
            username : user.username,
            email : user.email
        }
    })


}


/**
 * @name LoginUserController
 * @description login a user, expect email and password in the body  
 * @access Public 
 */
async function LoginUserController(req,res){
      
       const {email, password} = req.body 

       // check the email address
       const user = await userModel.findOne({email})

       if(!user){
         return res.status(400).json({
            message : "invalid email address!"
         })
       }

       // check the password
       const IsvalidPassword = await bcrypt.compare(password, user.password)

       if(!IsvalidPassword){
          return res.status(400).json({
            message : "invalid password! Please correct the password"
          })
       }

       // create the token
       const token = jwt.sign(
        { id : user._id, username : user.username},
        process.env.JWT_SECRET,
        {expiresIn : "1d"}
       )

       // store token in cookie
       res.cookie("token", token)

       res.status(200).json({
         message : "User loggedIn successfully.",
         user : {
            id : user._id,
            username : user.username,
            email : user.email
         }
       })
}


/**
 * @name LogoutuserController
 * @description clear token from user cookies and add token in blacklist
 * @access Public 
 */
async function LogoutuserController(req,res){
    const token = req.cookies.token

    if(token){
        await tokenBlacklistModel.create( {token} )
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User Logged out successfully!"
    })
}


/**
 * @name getMeController
 * @description get the current logged user details.
 * @access Private 
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message : "User detail fatch successfully.",
        user:{
            id : user._id,
            username : user.username,
            email : user.email
        }
    })
}



module.exports = {
    registerUserController,
    LoginUserController,
    LogoutuserController,
    getMeController
}