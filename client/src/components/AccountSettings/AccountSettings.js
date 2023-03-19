import React, { useEffect, useState } from 'react'
import styles from "./AccountSettings.module.scss"
import {useParams, Link, useNavigate} from "react-router-dom"
import Input from '../Input/Input'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import {setUser} from "../../Redux/CurrentUser"
import { RiErrorWarningFill } from 'react-icons/ri';
import formValidation from '../HelperFunctions/FormValidation'

function AccountSettings() {

const navigate = useNavigate()
const dispatch = useDispatch()
const {setting} = useParams()
const currentUser = useSelector(state => state.currentUser)

const [email, setEmail] = useState(currentUser.email)
const [newEmail, setNewEmail] = useState("")
const [currentPassword, setCurrentPassword] = useState("")
const [newPassword, setNewPassword] = useState("")
const [confirmNewPassword, setConfirmNewPassword] = useState("")
const [birthDate, setBirthDate] = useState("")
const [gender, setGender] = useState("")
const [active, setActive] = useState(false)
const [formErrors, setFormErrors] = useState(null)
const [alert, setAlert] = useState({alert: "", error: false})
const [loading, setLoading] = useState(false)

    useEffect(() => {
        
    }, [setting])


    const setInputValueToState = (value, setValue) => {
      setValue(value)
  }
  
  //sets the activation animation when an input is first interacted with
  const activate = () => {
      if (!active){
          setActive(true)
      }
  }

  const resetStates = () => {
    setNewEmail("")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setFormErrors(null)
    setAlert({alert: "", error: false})
    setLoading(false)
  }

  useEffect(() => {

    const settings = ["email", "password", "delete"]

    if (!settings.find(i => i === setting)){
      navigate("/") 
    }

    resetStates()


  }, [setting])

  useEffect(() => {

        

    const areThereNoErrors = formErrors ? formErrors.every(a => a === null) : false


    const changeApiCall = async () => {

        setLoading(true)

        const apiBody = newEmail ? {newEmail, currentPassword} : {currentPassword, newPassword, confirmNewPassword}

        console.log(apiBody)
        console.log(" api body")

        try{          
            const response = await fetch(`/api/auth/account/change/${setting}`, {
                method: "PUT",
                mode: "cors",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(apiBody)
            })
            
            const status = response.status
            console.log(status)

            if (status === 200){

                if (newEmail){
                  setEmail(newEmail)
                  dispatch(setUser({...currentUser, email: newEmail}))
                }

                resetStates()
                // setNewEmail("")
                // setCurrentPassword("")
                setAlert({alert:`${setting} has successfully been changed`, error: false})
                // setFormErrors(null)
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
            setAlert({alert:"There has been an unexpected error", error: true})
            setLoading(false)
        }
    }

    const deleteAccountApiCall = async () => {

      setLoading(true)

      try{

        const response = await fetch("/api/auth/account/delete", {
          method: "DELETE",
          mode: "cors",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({currentPassword})
        })

        const status = response.status

        if (status === 200){
          dispatch(setUser(null))
        }

        else if (status === 401 || status === 403 || status === 406){
          const data = await response.json()
          setFormErrors(data)
        }

        else{
          throw new Error()
        }

        setLoading(false)


      } catch(error){
        console.log(error)
        setAlert({alert:"There has been an unexpected error", error: true})
        setLoading(false)
      }
    }


    if (areThereNoErrors){
        // apiCall()

        if (setting === "email" || setting === "password"){
          changeApiCall()
        }

        else if (setting === "delete"){
          deleteAccountApiCall()
        }
    }

    else{
        console.log("errrorrrr")
    }

    // setLoading(false)



}, [formErrors])



  const changeEmail = (e) => {

    e.preventDefault()

    setAlert({alert: "", error: false})

    let formErrors = formValidation({email: newEmail, password: currentPassword}, currentUser.email)

    console.log(formErrors)

    setFormErrors(formErrors)
    activate()
        
  }

  const changePassword = (e) => {

    e.preventDefault()

    setAlert({alert: "", error: false})

    let formErrors = formValidation({password: currentPassword, newPassword, confirmNewPassword})

    console.log(formErrors)

    setFormErrors(formErrors)
    activate()
  }

  const deleteAccount = (e) => {
    e.preventDefault()

    setAlert({alert: "", error: false})

    let formErrors = formValidation({password: currentPassword})

    console.log(formErrors)

    setFormErrors(formErrors)
    activate()

    
  }

  console.log(setting)

  return (
    <form className={styles.AccountSettings} onSubmit={setting === "email" ? changeEmail : setting === "password" ? changePassword : setting === "delete" ? deleteAccount : false}>

      <div className={styles.container}>
      <Link to="/account/email">email</Link>
      <Link to="/account/password">password</Link>
      <Link to="/account/delete">delete</Link>
        <Link className={styles.logo} to="/"><img src="/assets/logo.svg" alt="Home Link Logo" /></Link> 

        {setting === "email" ?

          <div className={styles.section}>
            
            <Input type="text" active={true} for="currentEmail" label="Current Email" value={email} disabled={true}/>

            {!currentUser.confirmed ? 
              <div className={styles.emailConfirmationAlert}><RiErrorWarningFill size="35px" /> <p>Your email has not yet been verified. Please <Link to="/account/confirm">click here</Link> to go to the confirmation page.</p> </div>
              : false}

            <Input type="email" active={active} for="newEmail" error={formErrors ? formErrors[0] : false} label="New Email" onChange={(e) => setInputValueToState(e.target.value, setNewEmail)} onClick={activate} value={newEmail} placeholder="new email" disabled={loading}/>

          </div> : false}

        <Input type="password" active={active} for="currentPassword" error={formErrors ? formErrors[setting === "email" ? 1 : 0] : false} label="Current Password" onChange={(e) => setInputValueToState(e.target.value, setCurrentPassword)} onClick={activate} value={currentPassword} placeholder="current password" disabled={loading}/>


        {setting === "password" ?

          <div className={styles.section}>
          
              <Input type="password" active={active} for="newPassword" error={formErrors ? formErrors[1] : false} label="New Password" onChange={(e) => setInputValueToState(e.target.value, setNewPassword)} onClick={activate} value={newPassword} placeholder="new password" disabled={loading}/>

              <Input type="password" active={active} for="confirmNewPassword" error={formErrors ? formErrors[2] : false} label="Confirm New Password" onChange={(e) => setInputValueToState(e.target.value, setConfirmNewPassword)} onClick={activate} value={confirmNewPassword} placeholder="confirm new password" disabled={loading}/>

          </div> : false}

        
           {//setting === "delete" ?
          // <div className={styles.section}>
          


          //</div> : false
        }

        {loading ? 
          <FontAwesomeIcon className={styles.spinner} color='white' size="2x" icon={faSpinner} spin /> 
          : <input className={styles.submitInput} type="submit" value={setting === "email" ? "CHANGE EMAIL" : setting === "password" ? "CHANGE PASSWORD" : setting === "delete" ? "DELETE ACCOUNT" : ""}/>
        }

        {alert.alert ? <p className={styles.alert} style={{color: alert.error ? "red" : "#3CFF00"}}>{alert.alert}</p> : false}

        </div>



      

    </form>
  )
}

export default AccountSettings