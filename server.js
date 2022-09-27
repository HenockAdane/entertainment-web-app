const express = require("express")
const path = require("path")

const app = express()
const PORT = process.env.PORT || 3001

const apiRoutes = require("./api/routes/index")

if (process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}

app.listen(PORT, console.log("connected"))