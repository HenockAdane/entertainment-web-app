const titleModel = require("../Models/Title")
const bcrypt = require("bcrypt")
const sendEmail = require("../Controller/SendEmail")
const jwt = require('jsonwebtoken')
const userModel = require("../Models/User")


class TitleController {

    async getSearchQuery (req,res){

        const searchValue = req.params.q
        console.log(searchValue)

        try{

            if (searchValue){
            
                const titles = await titleModel.find({ $or: [
                    { title: { $regex: searchValue, $options: 'i' } },
                /*{ category: { $regex: searchValue, $options: 'i' } }*/
                ] }).limit(10)

                console.log(titles)
                res.status(200).send(titles)
            }

            else{
                res.status(200).send([])
            }


        }catch(error){
            console.log(error)
        }
    }

    async getAll (req,res){
        try{
            const titles = await titleModel.find()

            res.status(200).send(titles)
            
        } catch(error){
            console.log(error + "at getAll")
        }


    }

    async getCategory (req,res){

        const {category} = req.params

        if (category === "movies" || category === "series"){


            try{
                const titles = await titleModel.find({category: category === "movies" ? "Movie" : "TV Series"})



                res.status(200).send(titles)
            }catch(error){
                console.log(error + "get category")

            }
        }

        else{
            res.status(500).send()
        }
    }

    async getBookmarks(req,res){
        const {title, userID, accessToken} = req.body


        console.log(11)
        if (accessToken){
            console.log(45)
            res.cookie("accessToken", accessToken, {
                maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                httpOnly: true 
            })
        }

        try{
            const user = await userModel.findOne({_id: userID})

            const bookmarks = user.bookmarks

            const titles = await titleModel.find({title: {$in : bookmarks}})

            console.log(titles)
            console.log("bookmarks")

            res.status(200).send(titles)



            
        }catch(error){
            console.log(error + " at get bookmarks")
        }

    }

    async toggleBookmark(req,res){
        const {title, userID, accessToken} = req.body

        if (accessToken){
            res.cookie("accessToken", accessToken, {
                maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                httpOnly: true 
            })
        }

        
        try{
            const user = await userModel.findOne({_id: userID})
            const bookmarks = user.bookmarks
            const isBookmarked = bookmarks.find(i => i === title)
            if (isBookmarked){
                user.bookmarks = bookmarks.filter(i => i !== isBookmarked )
                console.log(user.bookmarks)
                await user.save()
                
            }

            else{
                user.bookmarks = [...bookmarks, title]
                console.log(user.bookmarks)
                await user.save()
            }

            res.status(200).send()
        }catch(error){

            console.log(error + " at togglebookmarks")

        }

    }

    
}


module.exports = new TitleController()