import React, { useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import styles from "./BookmarksPage.module.scss"
import TitleCard from '../TitleCard/TitleCard'
import { useSelector, useDispatch } from 'react-redux'
import GridContainer from '../GridContainer/GridContainer'
import { Link } from 'react-router-dom'
import { displayUserAuthTimeOut } from '../../Redux/ScreenMessages'


function BookmarksPage() {

  const dispatch = useDispatch()
  const currentUser = useSelector(state => state.currentUser)
  const [bookmarkedTitles, setBookmarkedTitles] = useState([])

  useEffect((e) => {

    //api call to get titles by category (Movies/Series)
    const apiCall = async (e) => {

      try{

        const response = await fetch("/api/titles/bookmarks")

        if (response.status === 200){

          //no error
          const data = await response.json()
          console.log(data)

          setBookmarkedTitles([...data])
          
        }

        else if (response.status === 401){
          dispatch(displayUserAuthTimeOut(true))
        }

        //there has been an unexpected error
        else{
          console.log("!200 or 401")
          throw new Error()
        }

        

      } catch(error){
        console.log(error)
      }

    }

    apiCall()
  }, [])

  useEffect(() => {
    const filteredBookmarkedTitles = bookmarkedTitles.filter(i => currentUser.bookmarks.find(j => i.title === j))

    setBookmarkedTitles(filteredBookmarkedTitles)
  }, [currentUser.bookmarks])



  return (
    <div className={styles.BookmarksPage}>

      {bookmarkedTitles.length > 0 ? 
        <div>
          {bookmarkedTitles.find(i => i.category === "Movie") ? <GridContainer bookmarkPage={true} titleCards={bookmarkedTitles.filter(i => i.category === "Movie")} category="Bookmarked Movies" /> : false}
          {bookmarkedTitles.find(i => i.category === "TV Series") ? <GridContainer bookmarkPage={true} titleCards={bookmarkedTitles.filter(i => i.category === "TV Series")} category="Bookmarked TV Series" /> : false}
        
        </div> : 
      <h2>You have no bookmarks, <Link to="/">click here</Link> for suggested content</h2>
    }

    </div>
  )
}

export default BookmarksPage