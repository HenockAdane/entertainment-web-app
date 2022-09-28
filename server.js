const express = require("express")
const path = require("path")
const cors = require("cors")

const app = express()
const PORT = process.env.PORT || 3001


const apiRoutes = require("./api/routes/index")

if (process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
}

// app.use(cors())

app.get("/api", (req,res)=>{
    console.log("cookie")
    res.cookie("refreshToken", 987654321, {
        maxAge: 60000, //1 minute
        httpOnly: true
    })

    

    res.send("has cookie sent?")

})

app.listen(PORT, console.log("connected"))