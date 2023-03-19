import React, { useState, useEffect } from 'react'
import styles from "./SignUp.module.scss"
import {Link} from "react-router-dom"
import {useDispatch} from "react-redux"


import {setUser} from "../../Redux/CurrentUser"
import Input from "../Input/Input"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import formValidation from '../HelperFunctions/FormValidation'

function SignUp() {

    const dispatch = useDispatch()

    const [firstname, setFirstname] = useState("Example")
    const [lastname, setLastname] = useState("Name")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("12345678A")
    const [birthDate, setBirthDate] = useState("")
    const [gender, setGender] = useState("")
    const [active, setActive] = useState(false)
    const [formErrors, setFormErrors] = useState(null)
    const [alert, setAlert] = useState("")
    const [loading, setLoading] = useState(false)

    console.log(firstname)
    useEffect(() => {

        const areThereNoErrors = formErrors ? formErrors.every(a => a === null) : false

        const apiCall = async () => {

            setLoading(true)

            try{          
                const response = await fetch(`/api/auth/signup`, {
                    method: "POST",
                    mode: "cors",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({firstname,lastname, email, password})
                })


                const status = response.status
                console.log(status)

                if (status === 200){
                    const data = await response.json()
                    dispatch(setUser(data))
                    // dispatch(setFavourites(data.favourites))
                }

                else if (status === 401 || status === 403 || status === 406){
                    const data = await response.json()
                    setFormErrors(data)
                }

                else{
                    throw new Error()
                }

                setLoading(false)

                
                }catch(error){
                    console.log(error)
                    setAlert("There has been an unexpected error")
                    setLoading(false)
            }
        }


        if (areThereNoErrors){
            apiCall()
        }

        else{
            console.log("errrorrrr")
        }

    }, [formErrors])


    const signUp =  (e) => {
        e.preventDefault()



        let formErrors = formValidation({firstname, lastname, email, newPassword: password})
        console.log(formErrors)
        //assigns the formErros Array to the FormErrors state
        setFormErrors(formErrors)
        activate()
    }

    //everytime a user types in the input, the state value for is updated
    const setInputValueToState = (value, setValue) => {
        setValue(value)
    }
    
    //sets the activation animation when an input is first interacted with
    const activate = () => {
        if (!active){
            setActive(true)
        }
    }




    return (
        <div className={styles.SignUp}>

            <Link className={styles.logo} to="/"><img src="/assets/logo.svg" alt="Home Link Logo" /></Link>

            <form onSubmit={signUp}>

                <h2>Sign Up</h2>

                <Input type="text" active={active} for="firstname" error={formErrors ? formErrors[0] : false} label="First Name" onChange={(e) => setInputValueToState(e.target.value, setFirstname)} onClick={activate} value={firstname} placeholder="john" disabled={loading}/>

                <Input type="text" active={active} for="lastname" error={formErrors ? formErrors[1] : false} label="Last Name" onChange={(e) => setInputValueToState(e.target.value, setLastname)} onClick={activate} value={lastname} placeholder="john" disabled={loading}/>
                
                <Input type="email" active={active} for="email" error={formErrors ? formErrors[2] : false} label="Email" onChange={(e) => setInputValueToState(e.target.value, setEmail)} onClick={activate} value={email} placeholder="john@mail.com" disabled={loading}/>
                
                <Input type="password" active={active} for="password" error={formErrors ? formErrors[3] : false} label="Password" onChange={(e) => setInputValueToState(e.target.value, setPassword)} onClick={activate} value={password} placeholder="password" disabled={loading}/>

    

                {loading ? 
                    <FontAwesomeIcon className={styles.spinner} color='white' size="2x" icon={faSpinner} spin /> 
                    : <input className={styles.submitInput} type="submit" value="SIGN UP" />
                }

                <div>
                    <span>Already a Member?</span> <Link to="/signin">Sign In</Link>
                </div>
            </form>

            
            
        </div>
    )
}

export default SignUp
// <input type="password" name="password" required onChange={setInputValueToState} value={state.password} placeholder="Password"/>
//                 <input type="text" name="firstName" required onChange={setInputValueToState} value={state.firstName} placeholder="First Name" />
//                 <input type="text" name="lastName" required onChange={setInputValueToState} value={state.lastName} placeholder="Last Name" />
/*{                <Input type="date" name="birthDate"  onChange={(e) => setInputValueToState(e.target.value, setBirthDate)} value={birthDate} placeholder="Date of Birth" max='13-01-2000' />

                <div className={styles.genderContainer}>
    
                    <input type="button" name="gender"  onClick={(e) => setInputValueToState(e.target.value, setGender)} value="Male" style={{border: gender === "Male" ? "1px solid black" : "1px solid rgb(229, 299, 229)"}} />
                    
                    <input type="button" name="gender"  onClick={(e) => setInputValueToState(e.target.value, setGender)} value="Female" style={{border: gender === "Female" ? "1px solid black" : "1px solid rgb(229, 299, 229)"}} />
                </div>
    }*/