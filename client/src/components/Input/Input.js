import React from 'react'
import styles from "./Input.module.scss"

function Input(props) {
    return (
        <div className={props.active ? `${styles.inputContainer} ${styles.active}`: styles.inputContainer}>
            <div>
                <label  for={props.for} style={props.error ? {color: "red"}: props.disabled ? {color: "gray"} : {}}>{props.label}</label>
                <p>{props.error}</p>
            </div>
            <input type={props.type} name={props.for} disabled={props.disabled} onChange={props.onChange} onClick={props.onClick} value={props.value} max={props.max} placeholder={props.placeholder} style={props.error ? {border: "1px solid red"}: {}}/>
        </div>
    )
}

export default Input
