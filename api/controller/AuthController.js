const userModel = require("../Models/User")
const bcrypt = require("bcrypt")
const sendEmail = require("../Controller/SendEmail")
const jwt = require('jsonwebtoken')
// const verifyJWT = require("../Controller/VerifyJWT")


let tokens = []//{token:"£"£$34545, userID: 1234}

const formValidation = (inputs, userEmail) => {

    const {firstname,lastname, email, password, newPassword, confirmNewPassword} = inputs

    let formErrors = []

    //creating custom reuseable functions for form validation
    const isRequired = (n) => {
        //for inputs with no value
        formErrors = formErrors.map((a,i) => i === n ? "this field is required ": a)
    }

    const customError = (msg, n) => {
        formErrors = formErrors.map((a,i) => i === n ? msg: a)
    }    

    //checking that there is an input for firstname
    if (firstname || firstname === ""){

        formErrors[0] = null

        if (!firstname){
            isRequired(0)
        } else if (!/^[a-zA-Z\s]*$/.test(firstname)){
            customError(0, "firstname should only contain letters and spaces")
        }
    }

    //checking that there is an input for lastname
    if (lastname || lastname === ""){

        formErrors[1] = null

        if (!lastname){
            isRequired(1)
        } else if (!/^[a-zA-Z\s]*$/.test(lastname)){
            customError(1, "lastname should only contain letters and spaces")
        }
    }

    //checking that there is an input for email
    if (email || email === ""){

        formErrors[2] = null
        
        if (!email){
            isRequired(2)
        } else if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)){
            customError(2, "Please enter a valid email")
        } else if (email === userEmail){
            customError("Can not be the same as current email", 2)
        }
    }

    //checking that there is an input for password (user password / current password)

    if (password || password === ""){

        formErrors[3] = null

        if (!password){
            isRequired(3)
        }

    }

    //checking that there is an input for newPassword
    if (newPassword || newPassword === ""){

        formErrors[4] = null

        if (!newPassword){
            isRequired(4)
        } else if (newPassword === email){
            customError("Your email can't be your password", 4)
        } else if (newPassword.length < 8){
            customError("Password must be longer than ", 4)
        }
    }

    //checking that there is an input for confirmNewPassword
    if (confirmNewPassword || confirmNewPassword === ""){
        
        formErrors[5] = null

        if (!confirmNewPassword){
            isRequired(5)
        } else if (confirmNewPassword !== newPassword){
            customError("Passwords do not match", 5)
        }
    }

    console.log({formErrors})

    //filtering out all the empty array properties
    formErrors = formErrors.filter(i => i !== "")

    return formErrors




    // setFormErrors(formErrors)
    // activate()
        
}

class AuthController {
    async signUp (req,res){
        console.log(req.body)

        
        //retrive the data sent by the client from the request body object
        const {firstname, lastname, email, password} = req.body
        console.log(req.body)

       
        //checking validation for the form inputs
        let formErrors = formValidation({firstname, lastname, email, password})

        const noErrorsFound = formErrors.every(a => a === null)
        console.log(112)
        console.log(formErrors)
        console.log(noErrorsFound)

        try{
        
            //if form validation is fine
            if (noErrorsFound){
                
                //check if a user with this email address exists
                const emailAlreadyExist = await userModel.findOne({email})

                //a user is already using this email
                if (emailAlreadyExist){
                    res.status(406).send([null, null,"This email is taken",null])
                }


                //email is available for use
                else{

                    //hash password to store in database in case of a database leak
                    const hashedPassword = await bcrypt.hash(password, 10)

                    //creating a random confirmation code to send to the users email to confirm
                    let randomConfirmationCode = ""
                    const options = "abcdefghijklmnopqrstuvwxyz0123456789"
                    while (randomConfirmationCode.length < 50){
                        randomConfirmationCode+= options[Math.floor(Math.random() * options.length)]
                    }

                    // const refreshToken = jwt.sign({userID: user._id}, process.env.SECRET_5)

                    const user  = new userModel({
                        firstname, 
                        lastname, 
                        email, 
                        password: hashedPassword, 
                        bookmarks: [],
                        confirmed: false,
                        confirmationCode: {
                            value: randomConfirmationCode,
                            createdAt: new Date().getTime() // to use later in the confirmation function down below to compare with when the user attempts to confirm code to see if the set time (5mins) has expired or not
                        }
                    })

                    const accessToken = jwt.sign(
                        {userID: user._id}, 
                        process.env.SECRET,
                        { expiresIn: "5m" }
                    )

                    const refreshToken = jwt.sign(
                        {userID: user._id},
                        process.env.SECRET_5,
                        {expiresIn: "12h"}
                    )

                    // res.cookie("accessToken", accessToken, {
                    //     maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                    //     httpOnly: true 
                    // })

                    // res.cookie("refreshToken", refreshToken, {
                    //     maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                    //     httpOnly: true 
                    // })

                    res.cookie("accessToken", accessToken, {
                        //have not set a timer or expiry so that the cookie will clear when the user closes the browser
                        httpOnly: true 
                    })

                    res.cookie("refreshToken", refreshToken, {
                        maxAge: 43200000,//refresh token cookie will be set for 43,200,000ms or 12hrs before being invalid and in need for user to resign back in
                        httpOnly: true 
                    })



                    




                    await user.save()

                    const to = email,
                        subject = "Account Confirmation Code",
                        html= `<b><p>This Code Will Expire In 5 Minutes. If The Code Has Expired, Please Request For A New One.</p>
                        <p>Confirmation Code:${randomConfirmationCode}</p></b>`

                    const mailInfo = await sendEmail(to,subject,html)
                    if (mailInfo){
                        console.log("Email has been sent")
                    }

                    console.log("user has been created")


                    return res.status(200).send({firstname, lastname, email, bookmarks: [], confirmed: false})
                }

            //the form failed its validation
            } else{
                res.status(406).send(formErrors)
            } 

        } catch(error){
            console.log(error + "error at signup")
            res.status(500).send()
        }
        // else{
        //     res.status(422).send(formErrors)
        // }
    }

    async signIn (req,res){
        console.log(req.body)

        //retrive the email and password from the request body object
        const {email, password, keepSignedIn} = req.body


        //checking validation for the form inputs
        let formErrors = formValidation({email, password})

        console.log(formErrors)

        //confirming if there are no form validation errors
        const noErrorsFound = formErrors.every(a => a === null)

        try{
        
            if (noErrorsFound){

                //check if a user with this email address does exists
                const user = await userModel.findOne({email})

                console.log(user)

                //user does exist
                if (user){
                    
                    //comparing the given password from the client with the hashed password of the user to see if they match
                    const isPasswordCorrect = await bcrypt.compare(password, user.password)
                    
                    //password does match and is correct
                    if (isPasswordCorrect){


                        //creating a access JWT
                        const accessToken = jwt.sign(
                            {userID: user._id}, 
                            process.env.SECRET,
                            { expiresIn: "5s" }
                        )

                        //creating a refresh JWT
                        const refreshToken = jwt.sign(
                            {userID: user._id,
                            keepSignedIn: keepSignedIn},
                            process.env.SECRET_5,
                            {expiresIn: keepSignedIn ? "7d" : "12h"}
                        )
                            
                        //storing the access & refresh JWT in httpOnly cookie


                        // res.cookie("accessToken", accessToken, {
                        //     maxAge: 300000, //access token cookie will be valid for 300,000ms or 5 minutes before being invalid and in need for a renewal
                        //     httpOnly: true 
                        // })


                        //user wants to stay logged in
                        if (keepSignedIn){

                            res.cookie("accessToken", accessToken, {
                                maxAge: 604800000, //access token cookie will be set for 604,800,000ms or 7 days even though the actual access token will only be valid for 5minutes. This is so that even if the token expires, it can still be sent back to server and be renewed when making requests.
                                httpOnly: true 
                            })

                            res.cookie("refreshToken", refreshToken, {
                                maxAge: 604800000, //refresh token cookie will be set for 604,800,000ms or 7 days before being invalid and in need for user to resign back in
                                httpOnly: true 
                            })
                        }

                        //user doesnt want to stay logged in
                        else{

                            res.cookie("accessToken", accessToken, {
                                //have not set a timer or expiry so that the cookie will clear when the user closes the browser
                                httpOnly: true 
                            })

                            res.cookie("refreshToken", refreshToken, {
                                maxAge: 43200000,//refresh token cookie will be set for 43,200,000ms or 12hrs before being invalid and in need for user to resign back in
                                httpOnly: true 
                            })
                        }

                        
                        
                        res.status(200).send({firstName:user.firstName, lastName:user.lastName, email:user.email, birthDate:user.birthDate, bookmarks: user.bookmarks, confirmed: user.confirmed})
                        console.log("user has been logged in")

                    }
                    
                    //Password doesn't match and is incorrect
                    else{
                        
                        res.status(403).send()
                    }                
                }

                //user with this email isn't found
                else{
                    res.status(404).send()
                }
            }

            //the form failed its validation
            else{
                res.status(406).send(formErrors)
            }

            //any other errors not covered
        } catch(error){
            console.log(error + "error at signin")
            res.status(500).send()
        }
    
    }




    async signOut (req,res){

        console.log("logout")

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(200).send()
        
    }

    async changeEmail (req, res){
        const {newEmail, currentPassword, userID} = req.body

        //DONT FORGET FORM AUTH

        console.log("calling")
        console.log(newEmail, currentPassword)

        

        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            let formErrors = formValidation({email: newEmail, password: currentPassword}, user.email)

            const noErrorsFound = formErrors.every(a => a === null)

            console.log(noErrorsFound)
            console.log(formErrors)
            console.log(newEmail)
            console.log(user.email)

            if (!noErrorsFound){
                return res.status(406).send(formErrors)
            }

            //comparing the given password from the client with the hashed password of the user to see if they match
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

            if (!isPasswordCorrect){
                console.log("password incorrect")
                return res.status(403).send([null, "Password is incorrect"])
            }

            user.email = newEmail

            await user.save()

            console.log("user email has changed")
            
            return res.status(200).send()

        } catch(error){
            console.log(error + "at change email")
            res.status(500).send()
        }
    }

    async changePassword(req, res){
        const {currentPassword, newPassword, confirmNewPassword, userID} = req.body

        console.log("change password")

        //DONT FORGET FORM AUTH


        try{

            let formErrors = formValidation({password: currentPassword, newPassword, confirmNewPassword})

            const noErrorsFound = formErrors.every(a => a === null)
    
            if (!noErrorsFound){
                return res.status(406).send(formErrors)
            }

            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //comparing the given password from the client with the hashed password of the user to see if they match
            const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

            if (!isCurrentPasswordCorrect){
                console.log(isCurrentPasswordCorrect)
                console.log("password incorrect")
                return res.status(403).send()
            }

            //hash password to store in database in case of a database leak
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            user.password = hashedPassword

            await user.save()

            return res.status(200).send()

        } catch(error){
            console.log(error + "at change password")
            res.status(500).send()
        }

    }

    async confirmAccount(req,res){
        const {attemptedCode, userID} = req.body

        try{

            let formErrors = formValidation({password: attemptedCode})

            const noErrorsFound = formErrors.every(a => a === null)
    
            if (!noErrorsFound){
                return res.status(406).send(formErrors)
            }
            
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //get the confirmation object from the user
            const {confirmationCode} = user

            //check if the attempted code is correct and has not expired (it was set to be valid for 5minutes)
            if (confirmationCode.value === attemptedCode && new Date().getTime() - confirmationCode.createdAt <= 300000){
                //update the user model that they are confirmed
                user.confirmed = true
                user.confirmationCode = null
                
                //save the changes
                await user.save()
                console.log("user has been confirmed")
                return res.status(200).send()
            }

            else{
                //the code is either incorrect or has expired
                res.status(403).send()
            }

        } catch(error){
            //unexpected Error
            console.log(error + " at confirm user")
            res.status(500).send()
        }

    }

    async resendConfirmationCode(req,res){
        const {userID, accessToken} = req.body


        if (accessToken){
            res.cookie("accessToken", accessToken, {
                maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                httpOnly: true 
            })
        }

        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //create a new random confirmation code with a new created at time
            let randomConfirmationCode = ""
            const options = "abcdefghijklmnopqrstuvwxyz0123456789"
            while (randomConfirmationCode.length < 50){
                randomConfirmationCode+= options[Math.floor(Math.random() * options.length)]
            }

            //update the user object with the confirmation object and save
            user.confirmationCode = {
                value: randomConfirmationCode,
                createdAt: new Date().getTime()
            }

            await user.save()

            //details for the email that's going to be sent out to the user
            const to = user.email,
            subject = "Account Confirmation Code",
            html= `<b><p>This Code Will Expire In 5 Minutes. If The Code Has Expired, Please Request For A New One.</p>
                <p>Confirmation Code:${randomConfirmationCode}</p></b>`

            const mailInfo = await sendEmail(to,subject,html)
            if (mailInfo){
                console.log("Email has been sent")
                
            }

            // else{
            //     throw new Error()
            // }
            res.status(200).send()
        } catch(error){
            //unexpected error
            console.log(error + " at resend code")
            res.status(500).send()

        }

    }

    async loadUser(req,res,next){
        const userID = req.body.userID
        console.log("load user")

        console.log(userID)

        try{
            const user = await userModel.findOne({_id: userID})

            res.status(200).send(user)

        } catch(error){
            console.log(error + " at loaduser")
            res.status(500).send()


        }
    }

    async deleteAccount(req, res){
        const {userID, currentPassword} = req.body


        const password = currentPassword


        console.log("delete account")


        try{

            let formErrors = formValidation({password: currentPassword})

            const noErrorsFound = formErrors.every(a => a === null)
    
            if (!noErrorsFound){
                console.log(2)
                return res.status(406).send(formErrors)
            }
            
            console.log(3)
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //comparing the given password from the client with the hashed password of the user to see if they match
            const isPasswordCorrect = await bcrypt.compare(password, user.password)

            //the password the client entered and the user's password do not match
            if (!isPasswordCorrect){
                console.log(4)
                return res.status(403).send(["Password is incorrect"])
            }

            //deleting the user
            await userModel.deleteOne({_id: userID})


            res.clearCookie("accessToken")
            res.clearCookie("refreshToken")

            console.log("user deleted")

            return res.status(200).send()

        } catch(error){
            console.log(error + "at delete account")
            res.status(500).send()
        }

    }




    async signOutUserOnWebClose(req,res){

    }

    
}


module.exports = new AuthController()

/**class AuthController {
    async signUp (req,res){
        console.log(req.body)

        
        //retrive the data sent by the client from the request body object
        const {firstname, lastname, email, password} = req.body
        console.log(req.body)

       

        let formErrors = [null,null,null,null]

        //creating custom reuseable functions for form validation
        const isRequired = (n) => {
            formErrors = formErrors.map((a,i) => i === n ? "this field is required ": a)
        }

        const customError = (msg, n) => {
            formErrors = formErrors.map((a,i) => i === n ? msg: a)
        }

        //running the custome functions for form validation
        if (!firstname){
            isRequired(0)
        } else if (!/^[a-zA-Z\s]*$/.test(firstname)){
            customError(0, "firstname should only contain letters and spaces")
        }

        if (!lastname){
            isRequired(1)
        } else if (!/^[a-zA-Z\s]*$/.test(lastname)){
            customError(1, "firstname should only contain letters and spaces")
        }

        if (!email){
            isRequired(2)
        } else if (!/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)){
            customError(2, "Please enter a valid email")
        }

        if (!password){
            isRequired(3)
        } else if (password === email){
            customError("Your email can't be your password", 3)
        } else if (password.length < 8){
            customError("Password must be longer than ", 3)
        }


        const noErrorsFound = formErrors.every(a => a === null)
        console.log(formErrors)
        console.log(noErrorsFound)

        try{
        
            //if form validation is fine
            if (noErrorsFound){
                
                //check if a user with this email address exists
                const emailAlreadyExist = await userModel.findOne({email})

                //a user is already using this email
                if (emailAlreadyExist){
                    res.status(406).send([null, null,"This email is taken",null])
                }


                //email is available for use
                else{

                    //hash password to store in database in case of a database leak
                    const hashedPassword = await bcrypt.hash(password, 10)

                    //creating a random confirmation code to send to the users email to confirm
                    let randomConfirmationCode = ""
                    const options = "abcdefghijklmnopqrstuvwxyz0123456789"
                    while (randomConfirmationCode.length < 50){
                        randomConfirmationCode+= options[Math.floor(Math.random() * options.length)]
                    }

                    // const refreshToken = jwt.sign({userID: user._id}, process.env.SECRET_5)

                    const user  = new userModel({
                        firstname, 
                        lastname, 
                        email, 
                        password: hashedPassword, 
                        bookmarks: [],
                        confirmed: false,
                        confirmationCode: {
                            value: randomConfirmationCode,
                            createdAt: new Date().getTime() // to use later in the confirmation function down below to compare with when the user attempts to confirm code to see if the set time (5mins) has expired or not
                        }
                    })

                    const accessToken = jwt.sign(
                        {userID: user._id}, 
                        process.env.SECRET,
                        { expiresIn: "5m" }
                    )

                    const refreshToken = jwt.sign(
                        {userID: user._id},
                        process.env.SECRET_5,
                        {expiresIn: "12h"}
                    )

                    // res.cookie("accessToken", accessToken, {
                    //     maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                    //     httpOnly: true 
                    // })

                    // res.cookie("refreshToken", refreshToken, {
                    //     maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                    //     httpOnly: true 
                    // })

                    res.cookie("accessToken", accessToken, {
                        //have not set a timer or expiry so that the cookie will clear when the user closes the browser
                        httpOnly: true 
                    })

                    res.cookie("refreshToken", refreshToken, {
                        maxAge: 43200000,//refresh token cookie will be set for 43,200,000ms or 12hrs before being invalid and in need for user to resign back in
                        httpOnly: true 
                    })



                    




                    await user.save()

                    const to = email,
                        subject = "Account Confirmation Code",
                        html= `<b><p>This Code Will Expire In 5 Minutes. If The Code Has Expired, Please Request For A New One.</p>
                        <p>Confirmation Code:${randomConfirmationCode}</p></b>`

                    const mailInfo = await sendEmail(to,subject,html)
                    if (mailInfo){
                        console.log("Email has been sent")
                    }

                    console.log("user has been created")


                    return res.status(200).send({firstname, lastname, email, bookmarks: [], confirmed: false})
                }

            //the form failed its validation
            } else{
                res.status(406).send(formErrors)
            } 

        } catch(error){
            console.log(error + "error at signup")
            res.status(500).send()
        }
        // else{
        //     res.status(422).send(formErrors)
        // }
    }

    async signIn (req,res){
        console.log(req.body)

        //retrive the email and password from the request body object
        const {email, password, keepSignedIn} = req.body


        let formErrors = [null,null]
        console.log(req.cookies)
        console.log(1)

        //creating custom reuseable functions for form validation
        const isRequired = (n) => {
            formErrors = formErrors.map((a,i) => i === n ? "this field is required ": a)
        }

        const customError = (msg, n) => {
            formErrors = formErrors.map((a,i) => i === n ? msg: a)
        }

        //running the custom functions for form validation
        if(!email){
            isRequired(0)
        }

        else if (!/\S+@\S+\.\S+/.test(email)){
            customError("Please enter a correct email address", 0)
        }

        if(!password){
            isRequired(1)
        }

        console.log(formErrors)

        //confirming if there are no form validation errors
        const noErrorsFound = formErrors.every(a => a === null)

        try{
        
            if (noErrorsFound){

                //check if a user with this email address does exists
                const user = await userModel.findOne({email})

                console.log(user)

                //user does exist
                if (user){
                    
                    //comparing the given password from the client with the hashed password of the user to see if they match
                    const isPasswordCorrect = await bcrypt.compare(password, user.password)
                    
                    //password does match and is correct
                    if (isPasswordCorrect){


                        //creating a access JWT
                        const accessToken = jwt.sign(
                            {userID: user._id}, 
                            process.env.SECRET,
                            { expiresIn: "5s" }
                        )

                        //creating a refresh JWT
                        const refreshToken = jwt.sign(
                            {userID: user._id,
                            keepSignedIn: keepSignedIn},
                            process.env.SECRET_5,
                            {expiresIn: keepSignedIn ? "7d" : "12h"}
                        )
                            
                        //storing the access & refresh JWT in httpOnly cookie


                        // res.cookie("accessToken", accessToken, {
                        //     maxAge: 300000, //access token cookie will be valid for 300,000ms or 5 minutes before being invalid and in need for a renewal
                        //     httpOnly: true 
                        // })


                        //user wants to stay logged in
                        if (keepSignedIn){

                            res.cookie("accessToken", accessToken, {
                                maxAge: 604800000, //access token cookie will be set for 604,800,000ms or 7 days even though the actual access token will only be valid for 5minutes. This is so that even if the token expires, it can still be sent back to server and be renewed when making requests.
                                httpOnly: true 
                            })

                            res.cookie("refreshToken", refreshToken, {
                                maxAge: 604800000, //refresh token cookie will be set for 604,800,000ms or 7 days before being invalid and in need for user to resign back in
                                httpOnly: true 
                            })
                        }

                        //user doesnt want to stay logged in
                        else{

                            res.cookie("accessToken", accessToken, {
                                //have not set a timer or expiry so that the cookie will clear when the user closes the browser
                                httpOnly: true 
                            })

                            res.cookie("refreshToken", refreshToken, {
                                maxAge: 43200000,//refresh token cookie will be set for 43,200,000ms or 12hrs before being invalid and in need for user to resign back in
                                httpOnly: true 
                            })
                        }

                        
                        
                        res.status(200).send({firstName:user.firstName, lastName:user.lastName, email:user.email, birthDate:user.birthDate, bookmarks: user.bookmarks, confirmed: user.confirmed})
                        console.log("user has been logged in")

                    }
                    
                    //Password doesn't match and is incorrect
                    else{
                        
                        res.status(403).send()
                    }                
                }

                //user with this email isn't found
                else{
                    res.status(404).send()
                }
            }

            //the form failed its validation
            else{
                res.status(406).send(formErrors)
            }

            //any other errors not covered
        } catch(error){
            console.log(error + "error at signin")
            res.status(500).send()
        }
    
    }




    // async signOut(req,res,next){

    //     try{

    //         console.log("user has been signed out")

    //         res.cookie("refreshToken", null, {
    //             maxAge: 0, //7 days
    //             httpOnly: true 
    //         })

    //         res.status(200).send()
    //     }catch(error){
    //         console.log(error)
    //         res.status(500).send()
    //     }
    // }

    // revokeToken = async (req,res,next) =>{

    
    //     console.log(3)
    //         const bearer = req.headers['authorization']
    //         console.log(2)
        
    //         if (bearer){
        
    //             const bearerToken = bearer.split(" ")[1];
    //             const user = await userModel.findOne({token: bearerToken})
    //             user.token = null
    //             await user.save()
    //         } else{
    //             //forbidden
    //             res.status(403).send()
    //         }
    // }


    // async confirmAccount(req,res,next){
    //     const {attemptedCode, userID, accessToken} = req.body
    //     // const token = req.token
    //     // verifyJWT(req,res,next)
    //     try{
    //         console.log(1)

            
    //         //verify token and then get the userID from it
    //         // const decodedToken = jwt.verify(token, process.env.SECRET)
    //         console.log(userID)

    //         // console.log(decodedToken)

    //         //search for a user using the userID
    //       const user = await userModel.findOne({_id: userID})
            
    //       //get the confirmationCode object from the user
    //       const {confirmationCode} = user
            
    //       //checking if the attempted code is correct and not expired (valid for 5 minutes)
    //       if (confirmationCode.value === attemptedCode && new Date().getTime() - confirmationCode.createdAt <= 300000){
    //         user.confirmed = true
    //         user.confirmationCode = null
    //         await user.save()
    //         console.log("user has been confirmed")
    //         res.status(200).send({confirmed: true, accessToken})
    //       }
  
    //       else{
    //         res.status(403).send({accessToken})
    //       }
    //     } catch(error){
    //       console.log(error)
    //       res.status(500).send({accessToken})
    //     }
    // }

    // async resendConfirmationCode(req,res){
    //     const {userID, accessToken} = req.body
    //     console.log(1)
    //     try{


    //         const user = await userModel.findOne({_id: userID})


    //         let randomConfirmationCode = ""
    //         const options = "abcdefghijklmnopqrstuvwxyz0123456789"
    //         while (randomConfirmationCode.length < 50){
    //             randomConfirmationCode+= options[Math.floor(Math.random() * options.length)]
    //         }

    //         user.confirmationCode = {
    //             value: randomConfirmationCode,
    //             createdAt: new Date().getTime()
    //         }

    //         await user.save()

    //         const to = user.email,
    //             subject = "Account Confirmation Code",
    //             html= `<b><p>This Code Will Expire In 5 Minutes. If The Code Has Expired, Please Request For A New One.</p>
    //             <p>Confirmation Code:${randomConfirmationCode}</p></b>`

    //         const mailInfo = await sendEmail(to,subject,html)
    //         if (mailInfo){
    //             console.log("Email has been sent")
    //             res.status(200).send({accessToken})
    //         }

    //         else{
    //             throw new Error()
    //         }
            

    //     } catch(error){
    //       console.log(error)
    //       res.status(500).send({accessToken})
    //     }
    // }


    // async updateAccount(req,res){
    //     const {id, email, password, address, postCode, city} = req.body

    //     try{
    //         const user = await userModel.findOne({_id: id})

    //         const hashedPassword = await bcrypt.hash(password, 10)

    //         if (address && postCode && city){
    //             user = {...user, email, hashedPassword, address, postCode, city}
    //         }

    //         else{
    //             user = {...user, email, hashedPassword}
    //         }

    //         await user.save()

    //         const to = email,
    //             subject = "Account Update",
    //             html= `<b><p>Your Account Details Have Been Updated</p></b>`

    //         const mailInfo = await sendEmail(to,subject,html)
    //         if (mailInfo){
    //             console.log("Email has been sent")
    //         }
            
    //         console.log("code has been resent")

    //         res.status(200).send({user})

    //     } catch(error){
    //         console.log(error)
    //     }
    // }


    async signOut (req,res){

        console.log("logout")

        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(200).send()
        
    }

    async changeEmail (req, res){
        const {newEmail, currentPassword, userID} = req.body

        //DONT FORGET FORM AUTH

        console.log("calling")
        console.log(newEmail, currentPassword)

        

        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            let formErrors = [null,null]

            //creating custom reuseable functions for form validation
            const isRequired = (n) => {
            formErrors = formErrors.map((a,i) => i === n ? "this field is required ": a)
            }

            const customError = (msg, n) => {
            formErrors = formErrors.map((a,i) => i === n ? msg: a)
            }

            //running the custom functions for form validation
            if(!newEmail){
                isRequired(0)
            }

            else if (newEmail === user.email){
                customError("New email can not be the same as current email", 0)
            }

            else if (!/\S+@\S+\.\S+/.test(newEmail)){
                customError("Please enter a correct email address", 0)
            }

            if(!currentPassword){
                isRequired(1)
            }

            const noErrorsFound = formErrors.every(a => a === null)

            console.log(noErrorsFound)
            console.log(formErrors)
            console.log(newEmail)
            console.log(user.email)

            if (!noErrorsFound){
                return res.status(406).send(formErrors)
            }

            //comparing the given password from the client with the hashed password of the user to see if they match
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

            if (!isPasswordCorrect){
                console.log("password incorrect")
                return res.status(403).send([null, "Password is incorrect"])
            }

            user.email = newEmail

            await user.save()

            console.log("user email has changed")
            
            return res.status(200).send()

        } catch(error){
            console.log(error + "at change email")
            res.status(500).send()
        }
    }

    async changePassword(req, res){
        const {currentPassword, newPassword, confirmNewPassword, userID} = req.body

        console.log("change password")

        //DONT FORGET FORM AUTH

        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //comparing the given password from the client with the hashed password of the user to see if they match
            const isCurrentPasswordCorrect = await bcrypt.compare(currentPassword, user.password)

            if (!isCurrentPasswordCorrect){
                console.log(isCurrentPasswordCorrect)
                console.log("password incorrect")
                return res.status(403).send()
            }

            //hash password to store in database in case of a database leak
            const hashedPassword = await bcrypt.hash(newPassword, 10)

            user.password = hashedPassword

            await user.save()

            return res.status(200).send()

        } catch(error){
            console.log(error + "at change password")
            res.status(500).send()
        }

    }

    async confirmAccount(req,res){
        const {attemptedCode, userID} = req.body

        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //get the confirmation object from the user
            const {confirmationCode} = user

            //check if the attempted code is correct and has not expired (it was set to be valid for 5minutes)
            if (confirmationCode.value === attemptedCode && new Date().getTime() - confirmationCode.createdAt <= 300000){
                //update the user model that they are confirmed
                user.confirmed = true
                user.confirmationCode = null
                
                //save the changes
                await user.save()
                console.log("user has been confirmed")
                res.status(200).send()
            }

            else{
                //the code is either incorrect or has expired
                res.status(403).send()
            }

        } catch(error){
            //unexpected Error
            console.log(error + " at confirm user")
            res.status(500).send()
        }

    }

    async resendConfirmationCode(req,res){
        const {userID, accessToken} = req.body


        if (accessToken){
            res.cookie("accessToken", accessToken, {
                maxAge: 86400000, //user will stay logged in until 1 day has passed or until they sign out or until they close their session
                httpOnly: true 
            })
        }

        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //create a new random confirmation code with a new created at time
            let randomConfirmationCode = ""
            const options = "abcdefghijklmnopqrstuvwxyz0123456789"
            while (randomConfirmationCode.length < 50){
                randomConfirmationCode+= options[Math.floor(Math.random() * options.length)]
            }

            //update the user object with the confirmation object and save
            user.confirmationCode = {
                value: randomConfirmationCode,
                createdAt: new Date().getTime()
            }

            await user.save()

            //details for the email that's going to be sent out to the user
            const to = user.email,
            subject = "Account Confirmation Code",
            html= `<b><p>This Code Will Expire In 5 Minutes. If The Code Has Expired, Please Request For A New One.</p>
                <p>Confirmation Code:${randomConfirmationCode}</p></b>`

            const mailInfo = await sendEmail(to,subject,html)
            if (mailInfo){
                console.log("Email has been sent")
                
            }

            // else{
            //     throw new Error()
            // }
            res.status(200).send()
        } catch(error){
            //unexpected error
            console.log(error + " at resend code")
            res.status(500).send()

        }

    }

    async loadUser(req,res,next){
        const userID = req.body.userID
        console.log("load user")

        console.log(userID)

        try{
            const user = await userModel.findOne({_id: userID})

            res.status(200).send(user)

        } catch(error){
            console.log(error + " at loaduser")
            res.status(500).send()


        }
    }

    async deleteAccount(req, res){
        const {userID, password} = res.body


        try{
            //search for a user with the userID
            const user = await userModel.findOne({_id: userID})

            //comparing the given password from the client with the hashed password of the user to see if they match
            const isPasswordCorrect = await bcrypt.compare(password, user.password)

            //the password the client entered and the user's password do not match
            if (!isPasswordCorrect){
                return res.status(403).send()
            }

            //deleting the user
            await userModel.deleteOne({_id: userID})


            return res.status(200).send()

        } catch(error){
            console.log(error + "at delete account")
            res.status(500).send()
        }

    }




    async signOutUserOnWebClose(req,res){

    }

    
}**/