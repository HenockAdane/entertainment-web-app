const express = require("express")
const path = require("path")
const cors = require("cors")
const cookies = require("cookie-parser")
const mongoose = require("mongoose")
const titleModel = require("./api/Models/Title")


const app = express()
const PORT = process.env.PORT || 3001


const apiRoutes = require("./api/routes/index")

if (process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"))
    app.get("*", (req,res) => {
      req.sendFile(path.resolve(__dirname, "client/build", "index.html"))
    })
}

// app.use(cors())

async function runServer(){

    try{
        await mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
        console.log(err)
        console.log('Something went wrong with the db connection.')

       
        
    });

    
    
    // let options = {

    // };
    // app.use(express.static("public", options))
    

    app.use(express.json())
    app.use(cookies())
    app.use("/api", apiRoutes)
    // app.use("/api/auth/confirm-account", verifyJWT)



    
    app.listen(PORT, console.log("connected"))

    // const title  = new titleModel(
    //   {
    //     "title": "Below Echo",
    //     "thumbnail": {
    //       "regular": {
    //         "small": "./assets/thumbnails/below-echo/regular/small.jpg",
    //         "medium": "./assets/thumbnails/below-echo/regular/medium.jpg",
    //         "large": "./assets/thumbnails/below-echo/regular/large.jpg"
    //       }
    //     },
    //     "year": 2016,
    //     "category": "TV Series",
    //     "rating": "PG",
        
    //     "isTrending": false
    //   }
    // )

    // title.save()

    } catch(error){
        console.log(error)
    }


}

runServer()





