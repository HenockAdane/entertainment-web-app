const express = require("express")
const path = require("path")
const cors = require("cors")
const cookies = require("cookie-parser")
const mongoose = require("mongoose")


const app = express()
const PORT = process.env.PORT || 3001


const apiRoutes = require("./api/routes/index")



// app.use(cors())

async function runServer(){

    // if (process.env.NODE_ENV === "production"){
    //     app.use(express.static("client/build"))
    //     app.get("*", (req,res) => {
    //         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    //     })
    // }

    if (process.env.NODE_ENV === "production"){

        app.use(express.static(path.join(__dirname, "build")))

        app.get("*", (req,res) => {
            res.sendFile(path.resolve(__dirname,'build', 'index.html'));
        })
    }

    // try{
    //     await mongoose.connect(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true }).catch(err => {
    //     console.log(err)
    //     console.log('Something went wrong with the db connection.')

       
        
    // });

    
    
    // let options = {

    // };
    // app.use(express.static("public", options))
    

    app.use(express.json())
    app.use(cookies())
    app.use("/api", apiRoutes)
    // app.use("/api/auth/confirm-account", verifyJWT)



    
    app.listen(PORT, console.log("connected"))


    // } catch(error){
    //     console.log(error)
    // }


}

runServer()





