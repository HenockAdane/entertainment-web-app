import React, {useEffect, useState, useRef} from 'react'
import Icons from '../Icons/Icons'
import styles from "./Sidebar.module.scss"
import {useDispatch, useSelector} from "react-redux"
import { Link } from 'react-router-dom'
import {GoSignOut} from "react-icons/go"
import { setUser } from '../../Redux/CurrentUser'
import {gsap} from "gsap"
import {useLocation} from "react-router-dom"
import { toggleSlideInfo } from '../../Redux/ScreenMessages';

function Sidebar() {

  const location = useLocation()
  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const screenSize = useSelector(state => state.screenSize)
  const [isPhoneNavOpen, setIsPhoneNavOpen] = useState(false)
  const containerRef = useRef(null)


  // useEffect(() => {

  //   const target = containerRef.current

  //   // if (screenSize < 900){
  //   //   if (isPhoneNavOpen){
  //   //     console.log("opening")
  //   //     gsap.timeline()
  //   //     .to(target, 0, {display: "unset"})
  //   //     .to(target, 0.5, {left: "0"})
  //   //   }

  //   //   else{
  //   //     console.log("closing")
  //   //       gsap.timeline()
  //   //       .to(target, 1, {left: "-100%"})
  //   //       .to(target, 1, {display: "none"})
          
  //   //   }
  //   // }

  //   console.log(isPhoneNavOpen)
  // }, [isPhoneNavOpen, screenSize])


  const signOut = async () => {

    try{
        const response = await fetch("/api/auth/signout")

        console.log(response.status)
        if (response.status !== 200){
          throw new Error()
        }

        console.log("user has been signed out")

        dispatch(setUser(null))

    } catch(error){
      console.log(error)
    }

  }

  const promptSlideInfo = () => {
    console.log("promt info clicked")
    dispatch(toggleSlideInfo(true))
  }


  return (
    <div className={styles.Sidebar}>



        <div className={styles.logo}>
          <Icons img="/assets/logo.svg" link to="/" alt="home" />
        </div>

        <nav className={styles.nav}>
            <Icons link to="/" img={location.pathname == "/" ? "/assets/icon-category-home.svg" : "/assets/icon-nav-home.svg"} alt="home" />

            <Icons link to="/category/movies" img={location.pathname == "/category/movies" ? "/assets/icon-category-movie.svg" : "/assets/icon-nav-movies.svg"} alt="movies"/>

            <Icons link to="/category/series" img={location.pathname == "/category/series" ? "/assets/icon-category-tv.svg" : "/assets/icon-nav-tv-series.svg"}  alt="series" />

            {currentUser ? 
              <Icons link to="/bookmarks" img={location.pathname == "/bookmarks" ? "/assets/icon-category-bookmark.svg" : "/assets/icon-nav-bookmark.svg"} alt="bookmarks" /> 
              :
              <Icons onClick={promptSlideInfo} img="/assets/icon-nav-bookmark.svg" alt="bookmarks" /> }
            {currentUser ? <Icons svg={<GoSignOut size="23.4px"/>} onClick={signOut}/> : false}
        </nav>

       
          {currentUser ? 
            <div className={styles.avatar}>
              <Icons link img="/assets/user.png" to="/account" alt="profile"/> 
              
            </div> : 
            
            <div className={`${styles.avatar} ${styles.signIn}`}>
              <Link to="/signin" >Sign In</Link>
            </div>
          }
        


    
          </div>
  )
}

export default Sidebar

// <div className={styles.avatar}>
// {currentUser ? <Icons link img="/assets/user.png" to="/profile" alt="profile"/>         <henock adane />: 

//   <Link to="/signin" className={styles.signIn}>Sign In</Link>
// }
// </div> 

    {/**<header className={styles.phoneHeader}>
      <div className={isPhoneNavOpen ? `${styles.menu} ${styles.open}` : `${styles.menu}`} onClick={toggleMenu} >
        <div className={styles.burger}></div>
      </div>

      <div className={styles.logo}>
            <Icons img="/assets/logo.svg" to="/" alt="home" />
      </div>
  </header>**/}

   {/** <div className={styles.container} ref={containerRef}> **/}