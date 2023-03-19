import React, { useEffect, useRef, useState } from 'react'
import styles from "./GridContainer.module.scss"
import TitleCard from '../TitleCard/TitleCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import {gsap} from "gsap"

function GridContainer(props) {

  const slideInfoRef = useRef(null)

  const [slideInfo, setSlideInfo] = useState(false)

  useEffect(() => {    

    if (slideInfo){
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
    setSlideInfo(true)
  }


  return (
    <div className={styles.GridContainer}>

        <h1>{props.category}</h1>

        <div className={`${styles.grid} ${props.titleCards.length < 0 ? styles.scaleUp : ""}`} >

          {props.titleCards.length > 0 ? props.titleCards.map(i => {


              return <TitleCard thumbnail={`..${i.thumbnail.regular.large}`} playLink="/movie" year={i.year} categoryImg="/assets/icon-nav-movies.svg" alt="Category Symbol" category={i.category} rating={i.rating} title={i.title} promptInfoSlide/>

          }) : <FontAwesomeIcon className={styles.spinner} color='white' size="5x" icon={faSpinner} fade />}
        </div>

    </div>
  )
}

export default GridContainer
