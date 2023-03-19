import React, { useState, useEffect } from 'react'
import styles from "./SignIn.module.scss"
import {useDispatch, useSelector} from "react-redux"
import {Link} from "react-router-dom"
import {setUser} from "../../Redux/CurrentUser"
import Input from "../Input/Input"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import { displayUserAuthTimeOut } from '../../Redux/ScreenMessages'
import formValidation from '../HelperFunctions/FormValidation'

// mhscxlodfswpiinjdn@tmmbt.com
function SignIn() {

    const dispatch = useDispatch()
    const showDisplayUserAuthTimeOut = useSelector(state => state.screenMessages.displayUserAuthTimeOut)

    const [email, setEmail] = useState("t@t.com")
    const [password, setPassword] = useState("12345678A")
    const [keepSignedIn, setKeepSignedIn] = useState(false)
    const [formErrors, setFormErrors] = useState(null)
    const [active, setActive] = useState(false)
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState("")


    useEffect(() => {
        // console.log(displayUserAuthTimeOut)
        if(showDisplayUserAuthTimeOut){
            setAlert("User session has expired")
        }
        
        return () => {
            dispatch(displayUserAuthTimeOut(false))
        }


    }, [])

 
    console.log(keepSignedIn + " reme")
    useEffect(() => {

        

        const areThereNoErrors = formErrors ? formErrors.every(a => a === null) : false


        const apiCall = async () => {

            setLoading(true)

            try{          
                const response = await fetch(`/api/auth/signin`, {
                    method: "POST",
                    mode: "cors",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email, password, keepSignedIn})
                })
                
                const status = response.status
                console.log(status)

                if (status === 200){
                    
                    const data = await response.json()

                    dispatch(setUser(data))
                }

                else if (status === 403 || status === 404){
                    setAlert("The email or password are incorrect")
                }

                else if (status === 406){
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

        // setLoading(false)



    }, [formErrors])

    const signIn = (e) => {

        e.preventDefault()

        setAlert("")

        let formErrors = formValidation({email, password})

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
        <div className={styles.SignIn}>


            <Link className={styles.logo} to="/"><img src="/assets/logo.svg" alt="Home Link Logo" /></Link>
            
            <form onSubmit={signIn}>

                <h2>Login</h2>

                <Input type="email" active={active} for="email" error={formErrors ? formErrors[0] : false} label="Email" onChange={(e) => setInputValueToState(e.target.value,setEmail)} onClick={activate} value={email} placeholder="john@mail.com" disabled={loading} />
                
                <Input type="password" active={active} for="password" error={formErrors ? formErrors[1] : false} label="Password" onChange={(e) => setInputValueToState(e.target.value,setPassword)} onClick={activate} value={password} placeholder="password" disabled={loading}/>
                
                <div className={styles.keepSignedIn}>
                    <input type="checkbox" name="keepSignedIn" onChange={(e) => setInputValueToState(!keepSignedIn,setKeepSignedIn)} checked={keepSignedIn} />
                <label for="keepSignedIn">Keep me signed in</label>
                </div>
                {loading ? 
                    <FontAwesomeIcon className={styles.spinner} color='white' size="2x" icon={faSpinner} spin /> 
                    : <input className={styles.submitInput} type="submit" value="SIGN IN" />
                }
                
                {alert ? <p className={styles.alert}>{alert}</p> : false}

                <div>
                    <span>Not a Member?</span> <Link to="/signup">Join Us</Link>
                </div>
            </form>

            
            
        </div>
    )
}

export default SignIn
