import React, { useEffect, useState } from 'react'
import styles from "./SearchDiv.module.scss"
import Input from '../Input/Input'
import { useSearchParams, useLocation } from "react-router-dom"
import { setSearchActive, setSearchTitles } from '../../Redux/Search';
import { useDispatch } from 'react-redux';
import GridContainer from '../GridContainer/GridContainer'

function SearchDiv(props) {

  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q"))
  const [titleCards, setTitleCards] = useState([])
  const [compStyles, setCompStyles] = useState({
    fixedContainer: {height: "unset"},
    resultsContainer: {display: "none"}
  })

  useEffect(() => {
    
    const getSearchTitle = async () => {
      try{

        console.log("search")
        const response = await fetch(`/api/titles/search/${searchParams.get("q")}`)
        // ?q=${searchParams.get("q")}
        if (response.status !== 200){
          //error
        }

        const titles = await response.json()
        console.log(titles)

        setTitleCards(titles)

      }catch(error){
        console.log(error)
      }
    }

    if (searchParams.get("q")){
      setCompStyles({
        fixedContainer: {position: "fixed", height: "100%"},
        resultsContainer: {display: "unset"}
      })

      getSearchTitle()
    }

    else{
      setCompStyles({
        fixedContainer: {position: "unset", height: "unset"},
        resultsContainer: {display: "none"}
      })
    }


    

  }, [searchParams.get("q")])


  useEffect(() => {


    setSearch("")
    // setSearchParams({
    //   q: ""
    // });
 
  }, [location.pathname])

  const handleSearchChange  = (e, value = e.target.value) => {
    setSearch(value)
    setSearchParams({
      q: value,
    });


    
  }

  return (
    <div className={styles.SearchDiv}>

        <div className={styles.searchContainer}>
          <img src="/assets/icon-search.svg"/>
          <Input placeholder="Search for movies or TV series" value={search} onChange={handleSearchChange}/>
        </div>

          <div className={styles.resultsContainer} style={compStyles.resultsContainer}>
            <GridContainer titleCards={titleCards} category={`Search Results (${titleCards.length})`} />
          </div>

    </div>
  )
}

export default SearchDiv

// <div className={styles.SearchDiv}>
// <div className={styles.fixedContainer} style={compStyles.fixedContainer}>

//   <div className={styles.searchContainer}>
//     <img src="/assets/icon-search.svg"/>
//     <Input placeholder="Search for movies or TV series" value={search} onChange={handleSearchChange}/>
//   </div>

//     <div className={styles.resultsContainer} style={compStyles.resultsContainer}>
//       <GridContainer titleCards={titleCards.filter(i => !i.isTrending)} category="Recommended" />
//     </div>

// </div>
// </div>