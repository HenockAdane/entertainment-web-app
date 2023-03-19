import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {useParams} from "react-router-dom"
import styles from "./CategoryPage.module.scss"
import GridContainer from '../GridContainer/GridContainer'
import SearchDiv from '../SearchDiv/SearchDiv'

function CategoryPage() {

  const {category} = useParams()
  const [titleCards, setTitleCards] = useState([])
  const [searchTitle, setSearchTitle] = useState("")

  useEffect((e) => {
    

    setTitleCards([])

    //api call to get titles by category (Movies/Series)
    const apiCall = async (e) => {

      try{

        const response = await fetch(`/api/titles/category/${category}`)

        //there has been an unexpected error
        if (response.status !== 200){
          console.log("!200")
          throw new Error()
        }

        //no error
        const data = await response.json()

        // setTitleCards([...titleCards, ...data])
        setTitleCards([...data])

      } catch(error){
        console.log(error)
      }

    }

 

    apiCall()
  }, [category])

  


  return (
    <div className={styles.CategoryPage}>


      <GridContainer bookmarkPage={true} titleCards={titleCards} category={category === "movies" ? "Movies" : category === "series" ? "TV Series" : false } />

    </div>
  )
}

export default CategoryPage

