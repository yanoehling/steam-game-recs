import '../../style/main.css';
import React, { useState } from "react";


export default function CampoSenhas({index1, index2, validaTexto, validaSenha, valor1='', valor2=''}) {
    const [isValid, setIsValid] = React.useState(Array(2).fill(false))
    const [status, setStatus] = React.useState(Array(2).fill(''))
    const [senhas, setSenhas] = React.useState(Array(2).fill(''))

    const handleOnBlurTexto = (e) => {
        let respostas = validaTexto(e, 'Senha', index1)
        const nextStatus = status.map((c, i) => {
            let next
            i === 0 ? next = respostas.status : next = c
            return next
        });
        setStatus(nextStatus)
        const nextValid = isValid.map((c, i) => {
            let next
            i === 0 ? next = respostas.validade : next = c
            return next
        });
        setIsValid(nextValid)
        const nextSenha = senhas.map((c, i) => {
            let next
            i === 0 ? next = e.target.value : next = c
            return next
        });
        setSenhas(nextSenha)
    }
    
    const handleOnBlurSenha = (e) => {
        let respostas = validaSenha(e, senhas[0], 'Senha', index2)
        const nextText = status.map((c, i) => {
            let next
            i === 1 ? next = respostas.status : next = c
            return next
        });
        setStatus(nextText)
        const nextValid = isValid.map((c, i) => {
            let next
            i === 1 ? next = respostas.validade : next = c
            return next
        });
        setIsValid(nextValid)
        const nextSenha = senhas.map((c, i) => {
            let next
            i === 1 ? next = e.target.value : next = c
            return next
        });
        setSenhas(nextSenha)
    }

    return(
    <>
        <label>Escreva sua senha:</label>
        <input type='password' onBlur={handleOnBlurTexto}/>
        <p className={isValid[0] ? 'status-ok' : 'status-fail'}>{status[0]}</p>
        <label>Repita sua senha:</label>
        <input type='password' onBlur={handleOnBlurSenha}/>
        <p className={isValid[1] ? 'status-ok' : 'status-fail'}>{status[1]}</p>
    </>
    )
}