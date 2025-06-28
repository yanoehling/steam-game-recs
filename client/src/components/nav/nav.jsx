import LoginButton from "../login_button/login_button"
import { useState } from "react"

export default function NavBar({ showFriends }){

    return(
        <>
            <nav className="gray-color">
                <div className="flex-container-row roboto">
                    <a href="/">LOGO</a>
                    <a href="#">Loja</a>
                    <a href="#">Suporte</a>
                    <a onClick={showFriends}>Amigos</a>
                </div>
                <LoginButton />
            </nav>
        </>
    )
}