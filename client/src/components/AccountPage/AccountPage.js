import React from 'react'
import styles from "./AccountPage.module.scss"
import {Link} from "react-router-dom"

function AccountPage() {
  return (
    <div className={styles.AccountPage}>
        <Link className={styles.logo} to="/"><img src="/assets/logo.svg" alt="Home Link Logo" /></Link> 

        <div className={styles.container}>
            <h2>Account Settings</h2>
            <Link className={styles.routeLinks} to="/account/email">Email</Link>
            <Link className={styles.routeLinks} to="/account/password">Password</Link>
            <Link className={styles.routeLinks} to="/account/delete">Delete</Link>
            <Link className={styles.routeLinks} to="/account/email">Log Out</Link>
        </div>
    </div>
  )
}

export default AccountPage