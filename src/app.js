const express = require("express")
const cookieParser = require("cookie-parser")

const app = express()

app.use(express.json())// Body mathi JSON read karva
app.use(cookieParser()); // Headers mathi Cookies read karva

// Require all this routes here 
const authRouter = require("./routes/auth.routes")

// using all this routes here 
app.use("/api/auth",authRouter)

module.exports = app