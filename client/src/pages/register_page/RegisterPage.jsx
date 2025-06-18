import '../../style/main.css';
import Header from "../../components/header/Header"
import React, { useState } from "react";


function Input({index, label, tipo, name, onblur}){
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

function Senhas({index1, index2, validaTexto, validaSenha}) {
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

export default function RegisterPage(){
    const [validez, setValidez] = React.useState(Array(5).fill(false))

    function handleValidez(index, valor) {
        const nextValidez = validez.map((c, i) => {
            let next
            i === index ? next = valor : next = c
            return next
        });
        setValidez(nextValidez)
    }

    function validaEmBranco(e, nome, index){
        let valido;
        let resposta;
        if (e.target.value == ''){ 
            valido = false; 
            resposta = `${nome} não pode ser um espaço em branco.`
        } else {
            valido = true
            resposta = '🗸'
        }
        handleValidez(index, valido)
        return {validade: valido, status: resposta}
    }

    function validaEmail(e, nome, index){
        let respostas = {validade: false, status: ''};
        let texto = e.target.value
        if (texto == ''){ 
            respostas.validade = false; 
            respostas.status = `${nome} não pode ser um espaço em branco.`
        } else {
            let arrobas = 0
            for (let i = 0; i < texto.length; i++) {
                let char = texto.charCodeAt(i);
                if (char == 64) {
                    arrobas += 1
                }
            }
            if (arrobas >= 2) {
                respostas.validade = false
                respostas.status = `${nome} não pode conter mais de um @.`
            } else if (arrobas == 0){
                respostas.validade = false
                respostas.status = `${nome} deve conter um @.`
            } else {
                respostas.validade = true
                respostas.status = '🗸'
            }
        }
        handleValidez(index, respostas.validade)
        return respostas
    }

    function validaSenha(e, senha, nome, index){
        let respostas = {validade: false, status: ''};
        let texto = e.target.value
        if (texto == ''){ 
            respostas.validade = false; 
            respostas.status = `${nome} não pode ser um espaço em branco.`
        } else if (texto != senha){
            respostas.validade = false; 
            respostas.status = `As senhas devem ser iguais.`
        } else {
            respostas.validade = true
            respostas.status = '🗸'
        }
        handleValidez(index, respostas.validade)
        return respostas
    }

    //Return final
    return (
        <main className="flex-container-column roboto">
            <Header />
            <section className="login-menu gray-color flex-container-column">
            <h2 style={{marginBottom: '20px'}}>Faça sua Conta</h2>
            <form action="" className="asap">
                <Input index={0} label='Escreva seu nome completo:' tipo="text" name="Nome" onblur={validaEmBranco}/>
                <Input index={1} label='Escreva um nome para seu usuário:' tipo='text' name='Usuário' onblur={validaEmBranco}/>
                <Input index={2} label='Insira sua data de nascimento:' tipo='date' name='Data de nascimento' onblur={validaEmBranco}/>
                <Input index={3} label='Escreva seu e-mail:' tipo='email' name='E-mail' onblur={validaEmail}/>
                <Senhas index1={4} index={5} validaTexto={validaEmBranco} validaSenha={validaSenha}/>
                <div className="flex-container-row">
                    <button>Enviar</button>
                </div>
                
            </form>
        </section>
        </main>
    )
}