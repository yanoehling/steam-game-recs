import LoginButton from "../login_button/login_button"

export default function NavBar(){
    return(
        <>
            <nav className="gray-color">
                <div className="flex-container-row roboto">
                    <a href="/">LOGO</a>
                    <a href="#">Loja</a>
                    <a href="#">Suporte</a>
                    <a href="">Conversa</a>
                </div>
                <LoginButton />
            </nav>
        </>
    )
}