import '../../style/main.css';
import NavBar from '../../components/nav/nav.jsx';
import React, { useState } from "react";
import Campo from '../../components/campos/Campo'
import CampoSenhas from '../../components/campos/CampoSenhas';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer/footer.jsx';

export default function RegisterPage(){
    const [validez, setValidez] = React.useState(Array(5).fill(false))
    const [valores, setValores] = React.useState(Array(6).fill(''))
    const navigate = useNavigate();

    function handleValidez(index, valor) {
        const nextValidez = validez.map((c, i) => {
            let next
            i === index ? next = valor : next = c
            return next
        });
        setValidez(nextValidez)
    }

    function handleValores(index, valor) {
        const nextValor = valores.map((c, i) => {
            let next
            i === index ? next = valor : next = c
            return next
        });
        setValores(nextValor)
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
        handleValores(index, e.target.value)
        return {validade: valido, status: resposta}
    }

    async function validaUser(e, nome, index) {
        let respostas = {validade: false, status: ''};
        let texto = e.target.value
        if (texto === ''){ 
            respostas.validade = false; 
            respostas.status = `${nome} não pode ser um espaço em branco.`
        } else {
            // Usando GET com query parameters
            const url = `/check-user?username=${encodeURIComponent(texto)}`;

            let data_register = await fetch(url, {
                method: "GET",
                headers: {'Content-Type': 'application/json'}
            })
            const serverResponse = await data_register.json()
            if (!serverResponse.userExists) {
                respostas.validade = true;
                respostas.status = '🗸';
            } else {
                respostas.validade = false
                respostas.status = `Este nome já está em uso.`
            }
        }
        handleValidez(index, respostas.validade)
        handleValores(index, texto)
        return respostas
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
        handleValores(index, texto)
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
        handleValores(index, texto)
        return respostas
    }

    async function criarConta() {
        let validezes = 0
        for (let i = 0; i < validez.length; i++) {
            if (validez[i] === true) {
                validezes += 1
            } 
        }
        if (validezes === 5) {
            const data = {name: valores[0], username: valores[1], birthday: valores[2], email: valores[3], password: valores[4]}
            const jsonData = JSON.stringify(data)
            
            let data_register = await fetch('/register-account', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: jsonData
            })

            const serverResponse = await data_register.json();

            serverResponse.msg === "Sucesso ao criar registro." ? navigate('/') : console.log(serverResponse.msg)
        }
    }

    //Return final
    return (
        <main className="flex-container-column roboto">
            <header>
                <NavBar />
            </header>
            <section className="login-menu gray-color flex-container-column">
                <h2 style={{marginBottom: '20px'}}>Faça sua Conta</h2>
                <form action="" className="asap">
                    <Campo index={0} label='Escreva seu nome completo:' tipo="text" name="Nome" onblur={validaEmBranco}/>
                    <Campo index={1} label='Escreva um nome para seu usuário:' tipo='text' name='Usuário' onblur={validaUser}/>
                    <Campo index={2} label='Insira sua data de nascimento:' tipo='date' name='Data de nascimento' onblur={validaEmBranco}/>
                    <Campo index={3} label='Escreva seu e-mail:' tipo='email' name='E-mail' onblur={validaEmail}/>
                    <CampoSenhas index1={4} index={5} validaTexto={validaEmBranco} validaSenha={validaSenha}/>
                    <div className="flex-container-row">
                        <button type='button' onClick={criarConta}>Enviar</button>
                    </div>
                    
                </form>
            </section>
            <Footer />
        </main>
    )
}