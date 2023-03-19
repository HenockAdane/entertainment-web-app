import React, { useState, useEffect } from 'react'
import styles from "./confirmAccount.module.scss"
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {setUser, updateUser} from "../../Redux/CurrentUser"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'


import Input from "../Input/Input"
import { displayUserAuthTimeOut } from '../../Redux/ScreenMessages'



function ConfirmAccount() {

  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)

  const [formError, setFormError] = useState(null)
  const [attemptedCode, setAttemptedCode] = useState("")
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(false)

  const confirm = async (e) => {
    e.preventDefault()
    activate()

    setFormError(null)

    try{

      //if attemptedCode isn't a falsey value, send post request
      if(attemptedCode){
        setFormError(null)
        setLoading(true)
        const response = await fetch("/api/auth/confirm-account", {
          method: "POST",
          mode: "cors",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            attemptedCode
          })          
        })

        console.log(response.status)

        //if request and response went well update the user
        if (response.status === 200){
            dispatch(updateUser({confirmed: true}))

        }

        else if (response.status === 403){
          setFormError("The code entered is invalid")
          //setMessage("")
          // const data = await response.json()
          // if (data.accessToken){
          //   dispatch(updateUser({accessToken: data.accessToken}))
          // }

        }

        else if (response.status === 401){

          dispatch(displayUserAuthTimeOut(true))

        }

        else{
          throw new Error()
        }

        setLoading(false)
      }

      else{
        setFormError("this field is required")
      }

    }catch(error){
      console.log(error)
      setFormError("Unexpected error, please try again")
      setLoading(false)
    }
  }

  const resendCode = async (e) => {
    console.log("resent code")

    activate()
    setFormError(null)
    setLoading(true)

    try{
      
      const response = await fetch(`/api/auth/resend-confirmation-code`, {
        method: "POST",
        mode: "cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          // accessToken: currentUser.accessToken
        })
      })

      console.log(response.status)

      if (response.status === 200){
        setFormError("A new code has been sent")
      }

      else if (response.status === 401){
        dispatch(displayUserAuthTimeOut(true))
      }

      else{
        throw new Error()
      }

      setLoading(false)
      
      

    }catch(error){
      console.log(error)
      setFormError("Unexpected error, please try again")
      setLoading(false)
    }
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
    <div className={styles.ConfirmAccount}>

        <Link className={styles.logo} to="/"><img src="/assets/logo.svg" alt="Home Link Logo" /></Link>

        <form onSubmit={confirm}>

            <h2>Confirm Account Email</h2>

            <Input type="text" active={active} for="attemptedCode" error={formError ? formError : false} label="AttemptedCode" onChange={(e) => setInputValueToState(e.target.value, setAttemptedCode)} onClick={activate} value={attemptedCode} disabled={loading} />
            
            {loading ?
              <FontAwesomeIcon className={styles.spinner} color='white' size="2x" icon={faSpinner} spin /> 
              :
            <div className={styles.prompts}>
              <input className={styles.submitInput} type="submit" value="CONFIRM" />
              
              {alert ? <p className={styles.alert}>{alert}</p> : false}

              <div className={styles.resend}>
                  <span>Code expired?</span> <input className={styles.submitInput} type="button" onClick={resendCode} value="RESEND CODE" />
              </div>
            </div>}
        </form>

    </div>
  )
}

export default ConfirmAccount