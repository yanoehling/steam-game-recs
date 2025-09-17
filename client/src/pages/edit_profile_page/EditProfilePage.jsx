import '../../style/main.css';
import NavBar from '../../components/nav/nav.jsx';
import React, { useState } from "react";
import { useEffect } from 'react';
import Campo from '../../components/campos/Campo'
import CampoSenhas from '../../components/campos/CampoSenhas';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import Footer from '../../components/footer/footer.jsx';
import FriendList from '../../components/friendList/friendList.jsx';


export default function EditProfilePage(user){
    const [username, setUsername] = React.useState('')
    const [gotData, setGotData] = React.useState(false)
    const [validez, setValidez] = React.useState(Array(5).fill(false))
    const [valores, setValores] = React.useState(Array(6).fill(''))
    const [showFriendList, setShowFriendList] = React.useState(false)
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem("TOKEN")

    useEffect(()=>{
        if (!TOKEN) {
            navigate('/')
        }
    }, [TOKEN])
    
    const showFriends = () => {
        if(TOKEN){
        setShowFriendList(true)
        }
    }

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
        } else if (texto.includes(" ")) {
            respostas.validade = false; 
            respostas.status = `${nome} não pode ter espaços vazios.`
        } else if (texto === username){
            respostas.validade = true;
            respostas.status = '🗸';
        } else {
            // Usando GET com query parameters

            const url = `https://steamrecommendationsserver.onrender.com/users/check?username=${encodeURIComponent(texto)}`;

            let data_register = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
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

    const editarConta = async () => {
        let validezes = 0
        for (let i = 0; i < validez.length; i++) {
            if (validez[i] === true) {
                validezes += 1
            } 
        }
        if (validezes === 5) {
            const data = { 
                name: valores[0],
                username: valores[1],
                birthday: valores[2], 
                email: valores[3], 
                password: valores[4]
            }
            const jsonData = JSON.stringify(data)
            
            let data_register = await fetch(`https://steamrecommendationsserver.onrender.com/users`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${TOKEN}`},
                body: jsonData
            })

            const serverResponse = await data_register.json();
            serverResponse.msg === "Sucesso ao editar perfil" ? navigate('/home') : console.log(serverResponse.msg)
        }
    }

    async function getData() {
        const profile_data = await fetch(`https://steamrecommendationsserver.onrender.com/users/me`,
        {method: "GET",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${TOKEN}`
        }});

        const serverResponse = await profile_data.json()
        if (serverResponse._id) {
            let nextValores = [serverResponse.name, serverResponse.username, serverResponse.birthday, serverResponse.email, serverResponse.password, serverResponse.password]
            setGotData(true)
            setUsername(serverResponse.username)
            setValores(nextValores)
        } else {
            console.log(serverResponse);
        }
    }

    //Return final
    if (!gotData) {
        getData()
    } else {
        return (
            <>
            <main className="roboto fundo-jogos">
                {showFriendList && (
                    <FriendList onClose={() => setShowFriendList(false)}/>
                )}
                <header>
                    <NavBar showFriends={showFriends}/>
                </header>
                <section className="login-menu gray-color flex-container-column">
                    <h2 style={{marginBottom: '20px'}}>Editar Perfil</h2>
                    <form action="" className="asap">
                        <Campo index={0} label='Escreva seu nome completo:' tipo="text" name="Nome" onblur={validaEmBranco} valor={valores[0]}/>
                        <Campo index={1} label='Escreva um nome para seu usuário:' tipo='text' name='Usuário' onblur={validaUser} valor={valores[1]}/>
                        <Campo index={2} label='Insira sua data de nascimento:' tipo='date' name='Data de nascimento' onblur={validaEmBranco} valor={valores[2]}/>
                        <Campo index={3} label='Escreva seu e-mail:' tipo='email' name='E-mail' onblur={validaEmail} valor={valores[3]}/>
                        <CampoSenhas index1={4} index={5} validaTexto={validaEmBranco} validaSenha={validaSenha} valor1={valores[4]} valor2={valores[5]}/>
                        <div className="flex-container-row">
                            <button type='button' onClick={editarConta}>Enviar</button>
                        </div>
                        
                    </form>
                </section>
            </main>
            <Footer />
            </>
        )
    }
    
}