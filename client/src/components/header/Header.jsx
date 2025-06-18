import '../../style/main.css';
import LoginButton from '../../components/login_button/login_button.jsx';

function Header() {
    return (
        <header className="flex-container-column">
            <nav className="gray-color">
                <div className="flex-container-row roboto">
                <a href="/">LOGO</a>
                <a href="#">Loja</a>
                <a href="#">Suporte</a>
                <a href="">Conversa</a>
                </div>
                <LoginButton></LoginButton>
            </nav>
        </header>
    )
}

export default Header