import '../../style/main.css';
import React, { useState } from "react";

export default function Campo({index, label, tipo, name, onblur}){
    const [isValid, setIsValid] = React.useState(false)
    const [text, setText] = React.useState('')
    const handleOnBlur = async (e) => {
        let respostas = await onblur(e, name, index)
        if (respostas) {
            if (Object.hasOwn(respostas, 'status')) {
                setText(respostas.status)
            }
            if (Object.hasOwn(respostas, 'validade')) {
                setIsValid(respostas.validade)
            }
        }
    }
    
    return(
    <>
        <label>{label}</label>
        <input type={tipo} onBlur={handleOnBlur}/>
        <p className={isValid ? 'status-ok' : 'status-fail'}>{text}</p>
    </>
    )
}