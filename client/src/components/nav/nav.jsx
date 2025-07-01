import LoginButton from "../login_button/login_button"
import { useState } from "react"

export default function NavBar({ showFriends }){
    const TOKEN = localStorage.getItem('TOKEN')
    return(
        <>
            <nav className="gray-color">
                <div className="flex-container-row roboto nav-bar">
                    <a href="/home">LOGO</a>
                    <a href="#">Loja</a>
                    <a href="#">Suporte</a>
                    <a onClick={TOKEN ? showFriends : console.log('Acesso negado.')}>Amigos</a>
                </div>
                <LoginButton />
            </nav>
        </>
    )
}