require('dotenv').config()
const connectTodb = require("./src/config/database")
const app = require("./src/app")

connectTodb();

app.listen(3000, () => {
    console.log("server is running port 3000")
})