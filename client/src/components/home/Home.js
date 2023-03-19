import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import styles from "./Home.module.scss"
import TitleCard from '../TitleCard/TitleCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner} from '@fortawesome/free-solid-svg-icons'
import GridContainer from '../GridContainer/GridContainer'
import Carousel from '../Carousel/Carousel'
import Input from '../Input/Input'
import SearchDiv from '../SearchDiv/SearchDiv'

function Home() {

  const {category} = useParams()
  const [titleCards, setTitleCards] = useState([])
  const [search, setSearch] = useState("")


  useEffect((e) => {

    const apiCall = async (e) => {

      try{

        const response = await fetch(`/api/titles`)

        if (response.status !== 200){
          console.log("!200")
          throw new Error()
        }

        const data = await response.json()

        console.log(data)

        // const data = await response.json()

        setTitleCards(data)

      } catch(error){
        console.log(error)

      }

    }

    apiCall()
  }, [])

  const setInputValueToState = (value, setValue) => {
    setValue(value)
    console.log(value)
  }

  // <input type="text" placeholder="Search for movies or TV series" value={search} />
  return (
    <div className={styles.Home}>

      <Carousel titleCards={titleCards.filter(i => i.isTrending)} />

      <GridContainer titleCards={titleCards.filter(i => !i.isTrending)} category="Recommended" />


    
        
    </div>
  )
}

export default Home

