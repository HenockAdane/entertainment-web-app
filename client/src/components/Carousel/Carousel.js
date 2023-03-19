import React, { useEffect, useRef, useState } from 'react'
import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import {Navigation, EffectFade} from "swiper"
import "swiper/css/navigation"
import "swiper/css/effect-fade"
import styles from "./Carousel.module.scss"
import TitleCard from '../TitleCard/TitleCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import {gsap} from "gsap"

function Carousel(props) {
    const slideInfoRef = useRef(null)
    const sliderRef = useRef(null)

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
    <div className={styles.Carousel} ref={sliderRef}>


      <h2>Trending</h2>

      <Swiper 
        modules={[Navigation, EffectFade]}
        navigation={props.titleCards.length > 0}
        effect
        autoplay
        speed={200}
        slidesPerView={3}
        loop
        className={styles.mySwiper}
      >

        {props.titleCards.length > 0 ? props.titleCards.map(i => {

          return <SwiperSlide className={styles.swiperSlide}> 
            <TitleCard style={{width:"100%"}} thumbnail={`..${i.thumbnail.regular.large}`} playLink="/movie" year={i.year} categoryImg="/assets/icon-nav-movies.svg" alt="Category Symbol" category={i.category} rating={i.rating} title={i.title} promptInfoSlide={promptSlideInfo}/>
            </SwiperSlide>

        }) : <FontAwesomeIcon className={styles.spinner} color='white' fade spin size="5x" icon={faSpinner} />}
        
      </Swiper>


    </div>
  )
}

export default Carousel

// <button onClick={slideRight} style={{width: "200%"}}>CLICK HERE</button>
// <div className={styles.flex}>
//     {props.titleCards.length > 0 ? props.titleCards.map(i => {


//         return <TitleCard thumbnail={`..${i.thumbnail.regular.large}`} playLink="/movie" year={i.year} categoryImg="/assets/icon-nav-movies.svg" alt="Category Symbol" category={i.category} rating={i.rating} title={i.title} promptInfoSlide={promptSlideInfo}/>

//     }) : <FontAwesomeIcon color='white' fade spin size="5x" icon={faSpinner} />}
// </div>
// <button onClick={slideLeft} style={{width: "200%"}}>CLICK HERE</button>