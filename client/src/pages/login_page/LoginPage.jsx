import '../../style/main.css';
import NavBar from '../../components/nav/nav.jsx';
import Campo from '../../components/campos/Campo.jsx';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Footer from '../../components/footer/footer.jsx';
import FriendList from '../../components/friendList/friendList.jsx';


function LoginPage(){
    const [showFriendList, setShowFriendList] = useState(false)   
    const [valores, setValores] = React.useState({})
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem("TOKEN")
    useEffect(()=>{
        if (TOKEN) {
            navigate('/home')
        }
    }, [TOKEN])

    function handleValores(e, name, index) {
        const nextValor = valores
        nextValor[name] = e.target.value
        setValores(nextValor)
    }

    async function fazerLogin() {
        if (valores.username && valores.password) {
            const data = {
                username: valores.username,
                password: valores.password
            };
            let data_register = await fetch('/auth/login', {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            const serverResponse = await data_register.json();
            localStorage.setItem("TOKEN", serverResponse.token)
            let statusLogin = document.getElementById("statusLogin");
            if (!serverResponse.token) {
                statusLogin.innerHTML = "Username ou senha incorretos.";
            } else {
                navigate('/home');
            }
        }
    }

    return (
        <>
        <main className="roboto fundo-jogos">
            {showFriendList && (
                <FriendList onClose={() => setShowFriendList(false)}/>
            )}
            <header>
                <NavBar showFriends={()=> setShowFriendList(true)}/>
            </header>
            <section className="login-menu gray-color flex-container-column">
                <h2 style={{marginBottom: '20px'}}>Faça o Login</h2>
                <form action="" className="asap">
                    <p id={'statusLogin'} className='status-fail'></p>
                    <Campo index={0} label={'Nome de usuário'} tipo='text' name={'username'} onblur={handleValores} />
                    <Campo index={1} label={'Senha'} tipo='password' name={'password'} onblur={handleValores} />
                    <div className="flex-container-row">
                        <button type='button' onClick={fazerLogin}>Enviar</button>
                    </div>
                </form>
                <a href="/register">Crie uma Conta</a>
            </section>
        </main>
        <Footer />
        </>
    )
}

export default LoginPage