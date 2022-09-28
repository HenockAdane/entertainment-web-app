import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react'

function App() {

  useEffect(() => {
    const apicall = async () => {try{
        const response = await fetch("/api")

        if (response.status !== 200){
          throw new Error()
        }

        else{
          console.log("api call was success")
          console.log(response)
          const data = await response.json()
          console.log(data)
        }

    } catch(error){
      console.log(error)
    }}
    apicall()
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
