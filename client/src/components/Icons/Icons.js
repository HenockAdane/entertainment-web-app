import React from 'react'
import { Link } from 'react-router-dom'
import styles from "./Icons.module.scss"

function Icons(props) {
  return (
    props.link ? <Link className={styles.Icons} to={props.to}>
        {props.img ? <img src={props.img} alt={props.alt} /> : props.svg}
    </Link> : 
    <button className={`${styles.Icons} ${styles.Btn}`} onClick={props.onClick}>{props.img ? <img src={props.img} alt={props.alt} /> : props.svg}</button>


  )
}

export default Icons