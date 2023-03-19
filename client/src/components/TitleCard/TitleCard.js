import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from "./TitleCard.module.scss"
import {useDispatch, useSelector} from "react-redux"
import {updateUser} from "../../Redux/CurrentUser"
import {gsap} from "gsap"
import { toggleSlideInfo } from '../../Redux/ScreenMessages';
import { displayUserAuthTimeOut } from '../../Redux/ScreenMessages'

function TitleCard(props) {

  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const [bookmarked, setBookmarked] = useState("empty")
  const [slideInfo, setSlideInfo] = useState(false)
  const slideInfoRef = useRef(null)



  useEffect(() => {
    if (currentUser){
      currentUser.bookmarks.find(i => i === props.title) ? setBookmarked("full") : setBookmarked("empty")
    }
  }, [currentUser])


  useEffect(() => {    

    if (slideInfo && !currentUser){
        gsap.timeline()
        .to(slideInfoRef.current, 0, {display: "unset"})
        .to(slideInfoRef.current, 0.5, {right: "0"})
        .to(slideInfoRef.current, 0.5, {right: "-100%", delay: 2})
        .to(slideInfoRef.current, 0, {display: "none"})
    }

    setSlideInfo(false)


    
  }, [slideInfo])


  const promptSlideInfo = () => {
    console.log("promt info clicked")
    dispatch(toggleSlideInfo(true))
  }

  const toggleBookmark = async (e) => {
    console.log(3)

    try{
      const response = await fetch("/api/titles/toggle-bookmark", {
        method: "PUT",
        mode: "cors",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title: props.title})
    })

    console.log(response.status)

    if (response.status === 200){
      if (bookmarked === "empty"){
        dispatch(updateUser({bookmarks: [...currentUser.bookmarks, props.title]}))
        // setBookmarked("full")
      }
  
      else{
        dispatch(updateUser({bookmarks: currentUser.bookmarks.filter(i => i !== props.title)}))
        // setBookmarked("empty")
      }
    }

    if (response.status === 401){
      dispatch(displayUserAuthTimeOut(true))
    }

    else{
      throw new Error()
    }






    }catch(error){
      console.log(error)
    }
  }

  // <Link className={styles.bookmark} to="/signin"><img src="/assets/icon-bookmark-empty.svg" alt="bookmark" /></Link>}
  return (
    <div className={styles.TitleCard} style={props.style}>


        <div className={styles.thumbnail}>
              <img className={styles.img} src={props.thumbnail} alt={props.alt} />
              {currentUser ? <button type="button" onClick={toggleBookmark} className={styles.bookmark}><img src={`/assets/icon-bookmark-${bookmarked}.svg`} alt="bookmark" /></button> : 

              <button className={styles.bookmark} type="button" onClick={promptSlideInfo}><img src="/assets/icon-bookmark-empty.svg" alt="bookmark" /></button>}

              <button className={styles.playBtn} type="button" to={props.playLink}>
                  <img src="/assets/icon-play.svg" alt="start" />
                  <p>Play</p>
              </button>
        </div>

        <div className={styles.details}>
            <span>{props.year}</span>
            <div className={styles.dots}></div>

            <img src={props.categoryImg} alt={props.alt} />
            <span>{props.category}</span>
            <div className={styles.dots}></div>

            <span>{props.rating}</span>

        </div>

        <h3>{props.title}</h3>
    </div>
  )
}

export default TitleCard