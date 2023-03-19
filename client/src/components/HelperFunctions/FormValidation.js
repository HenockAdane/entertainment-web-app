// import {useState} from "react";
// import { useSelector, useDispatch } from 'react-redux'



const formValidation = (inputs, userEmail) => {


    // const currentUser = useSelector(state => state.currentUser)
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

export default formValidation




// const useFormValidation = (inputs) => {



//     e.preventDefault()

//     setAlert({alert: "", error: false})
//     let formErrors = [null,null]

//     //creating custom reuseable functions for form validation
//     const isRequired = (n) => {
//       formErrors = formErrors.map((a,i) => i === n ? "this field is required ": a)
//     }

//     const customError = (msg, n) => {
//       formErrors = formErrors.map((a,i) => i === n ? msg: a)
//     }

//     input = {
//         type: "email",
//         data: ["w@W.com", "t@t.com"]
//     }

//     //checking if there are email inputs
//     const email = inputs.find(i => i.type === "email")

//     if (email){

//         email.


//     }



//     //running the custom functions for form validation
//     if(!newEmail){
//         isRequired(0)
//     }

//     else if (newEmail === email){
//         customError("Can not be the same as current email", 0)
//     }

//     else if (!/\S+@\S+\.\S+/.test(newEmail)){
//         customError("Please enter a correct email address", 0)
//     }

//     if(!currentPassword){
//         isRequired(1)
//     }

//     console.log({formErrors})

//     setFormErrors(formErrors)
//     activate()
        
//   }
