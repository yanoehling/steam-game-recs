import '../../style/main.css';
import React, { useState } from "react";

export default function Campo({index, label, tipo, name, onblur}){
    const [isValid, setIsValid] = React.useState(false)
    const [text, setText] = React.useState('')
    const handleOnBlur = (e) => {
        let respostas = onblur(e, name, index)
        setText(respostas.status)
        setIsValid(respostas.validade)
    }
    
    return(
    <>
        <label>{label}</label>
        <input type={tipo} onBlur={handleOnBlur}/>
        <p className={isValid ? 'status-ok' : 'status-fail'}>{text}</p>
    </>
    )
}