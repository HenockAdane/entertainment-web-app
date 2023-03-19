const jwt = require("jsonwebtoken")



const signOut = (res) => {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    res.status(401).send()

}


const verifyJWT = async (req,res,next) => {

    console.log(req.body.accessToken)

    const {accessToken, refreshToken} = req.cookies
    console.log(1)
    console.log(req.cookies)
    console.log(accessToken)

    try{
        console.log(2)

        if (accessToken){
            console.log("access token is true")

            jwt.verify(accessToken, process.env.SECRET_1, (err, decodedAccessToken) => {

                //if access token is invalid
                if (err){
                    console.log("access token is invalid")
                    //if access token has expired
                    if (err.name === "TokenExpiredError"){
                        console.log("access token is invalid due to expiration")
                        if (refreshToken){
                            jwt.verify(refreshToken, process.env.SECRET_2, (err2, decodedRefreshToken) =>{
                                console.log("refresh token is true")
                                //refresh token is invalid
                                if (err2){
                                    console.log("refresh token has error")
                                    throw new Error()
                                }

                                //refresh toke is valid and going to be used to create a new access token
                                else{
                                    console.log("refresh token is valid")
                                    const newAccessToken = jwt.sign(
                                        {userID: decodedRefreshToken.userID},
                                        process.env.SECRET_1,
                                        {expiresIn: "5m"}
                                        

                                    )

                                    if (decodedRefreshToken.keepSignedIn){

                                        res.cookie("accessToken", newAccessToken, {
                                            maxAge: 604800000, //access token cookie will be set for 604,800,000ms or 7 days even though the actual access token will only be valid for 5minutes. This is so that even if the token expires, it can still be sent back to server and be renewed when making requests.
                                            httpOnly: true 
                                        })
                                    }
                        
                                    else{
                        
                                        res.cookie("accessToken", newAccessToken, {
                                            //have not set a timer or expiry so that the cookie will clear when the user closes the browser
                                            httpOnly: true 
                                        })
                                    }

                                    req.body.keepSignedIn = decodedRefreshToken.keepSignedIn
                                    req.body.userID = decodedRefreshToken.userID
                                    // req.body.accessToken = newAccessToken
                                    next()
                                }
                            })
                        }

                        //a refresh token hasnt been provided
                        else{
                            console.log("refresh token isnt true")

                            throw new Error()
                        }
                    }

                    //the access token is invalid
                    else{
                        console.log("access token is invalid due to other reasons")

                        throw new Error()
                    }
                }

                //access token is valid
                else{
                    console.log("access token is valid")

                    req.body.userID = decodedAccessToken.userID

                    next()
                }
            })

        } else {
            console.log("access token isnt true")

            //access token hasnt been provided
            throw new Error()
        } 

    }catch(error){
        console.log(13)

        console.log(error + " at verify JWT")
        signOut(res)
    }
        
}


module.exports = verifyJWT