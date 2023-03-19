import logo from './logo.svg';
import './App.scss';
import {Routes, Route, redirect} from "react-router-dom"
import Sidebar from './components/Sidebar/Sidebar';
import Home from './components/home/Home';
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {Navigate, useNavigate, useHistory, useLocation, useSearchParams} from "react-router-dom"
import SignIn from "./components/SignIn/SignIn"
import SignUp from "./components/SignUp/SignUp"
import ConfirmAccount from './components/confirmAccount/confirmAccount';
import {setUser} from "./Redux/CurrentUser"
import CategoryPage from './components/CategoryPage/CategoryPage';
import BookmarksPage from './components/BookmarksPage/BookmarksPage';
import SearchDiv from './components/SearchDiv/SearchDiv';
import { toggleSlideInfo } from './Redux/ScreenMessages';
import {updateScreenSize} from "./Redux/ScreenSize"
import {gsap} from "gsap"
import AccountPage from './components/AccountPage/AccountPage';
import AccountSettings from './components/AccountSettings/AccountSettings';
function App() {

  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const screenMessages = useSelector(state => state.screenMessages)
  const currentUser = useSelector(state => state.currentUser)
  const search = useSelector(state => state.search)
  const [searchParams, setSearchParams] = useSearchParams();
  const [pathname, setPathname] = useState(window.location.pathname)
  const slideInfoRef = useRef(null)
  const [screenSize, setScreenSize] = useState(window.innerWidth)
  const [pathNames, setPathNames] = useState(["/signup", "/signin", "/account", "/account/confirm", "/account/password", "/account/email", "/account/delete"])


  useEffect(() => {

    
    window.addEventListener("resize", (e) => {
      dispatch(updateScreenSize(window.innerWidth))
    })
    
    const loadUser = async () => {
      try{
        const response = await fetch("/api/auth/load-user")

        if (response.status === 200){
          const user = await response.json()

          dispatch(setUser(user))

        }

      } catch(error){
        console.log(error)
      }
    }

    loadUser()


  }, [])

  useEffect(() => {
    if (screenMessages.displayUserAuthTimeOut){
      dispatch(setUser(null))
      navigate("/signin") 
    }
  }, [screenMessages.displayUserAuthTimeOut])

  useEffect(() => {
    dispatch(updateScreenSize(window.innerWidth))
  }, [])

  // useEffect(() => {
  //   const apicall = async () => {try{
  //       const response = await fetch("/api")

  //       if (response.status !== 200){
  //         throw new Error()
  //       }

  //       else{
  //         console.log("api call was success")
  //         console.log(response)
  //         const data = await response.json()
  //         console.log(data)
  //       }

  //   } catch(error){
  //     console.log(error)
  //   }}
  //   window.addEventListener("resize", (e)=>{
  //     console.log(e.target.innerWidth)
  //   })
  //   apicall()


  // }, [])



  // useEffect(() => {
  //   // console.log(searchParams.get("q"))
  //   // searchParams.get("q") ? console.log(true) : console.log(false)

    // setSearchParams({
    //   q: "",
    // });
  // }, [location.pathname])

  useEffect(() => {    

    if (screenMessages.slideInfo && !currentUser){
        gsap.timeline()
        .to(slideInfoRef.current, 0, {display: "unset"})
        .to(slideInfoRef.current, 0.5, {right: "0"})
        .to(slideInfoRef.current, 0.5, {right: "-100%", delay: 2})
        .to(slideInfoRef.current, 0, {display: "none"})
    }

    // setSlideInfo(false)
    dispatch(toggleSlideInfo(false))


    
  }, [screenMessages.slideInfo])

  // console.log(location.pathname)
  // console.log(pathNames.find(i => i === location.pathname))

  
  

  return (
    <div className="App">

      <p className="slideInfo" ref={slideInfoRef}>Please login to bookmark</p>

      
      {pathNames.find(i => i === location.pathname) ? false : <Sidebar />}

      <div className="mainContainer">

      {pathNames.find(i => i === location.pathname) ? false : <SearchDiv />}

      <div className='subContainer' style={searchParams.get("q") ? {display: "none"} : {}}>
      
        <Routes>

          <Route exact={true} path="/" element={<Home />} />

          <Route exact={true} path="/signup" element= {currentUser && currentUser.confirmed ? <Navigate to="/" /> : currentUser ? <Navigate to="/account/confirm" /> : <SignUp /> } />

          <Route exact={true} path="/signin" element= {currentUser && currentUser.confirmed ? <Navigate to="/" /> : currentUser ? <Navigate to="/account/confirm" /> : <SignIn /> } />

          <Route exact={true} path="/account" element={currentUser ? <AccountPage /> : <Navigate to="signin" />} />

          <Route exact={true} path="/account/:setting" element={currentUser ? <AccountSettings /> : <Navigate to="/signin" />} />

          <Route exact={true} path="/account/confirm" element={currentUser && currentUser.confirmed ? <Navigate to="/" /> : currentUser ? <ConfirmAccount /> : <Navigate to="/signin" />} />

          <Route exact={true} path="/category/:category" element={search.active ? false : <CategoryPage />} />

          <Route exact={true} path="/bookmarks" element={currentUser
          && currentUser.confirmed ? <BookmarksPage /> : currentUser ? <Navigate to="/account/confirm" /> : <Navigate to="/signin" />} />
          


        </Routes>
      </div>
      </div>

    </div>
  );
}

export default App;
