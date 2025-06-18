import '../../style/main.css';
import Header from "../../components/header/Header"

function LoginPage(){
    return (
        <main className="flex-container-column roboto">
            <Header />
            <section className="login-menu gray-color flex-container-column">
                <h2 style={{marginBottom: '20px'}}>Faça o Login</h2>
                <form action="" className="asap">
                    <label for="">Usuário</label>
                    <input type="text" name="" id=""/>
                    <label for="">Senha</label>
                    <input type="password" name="" id=""/>
                    <div className="flex-container-row">
                    <button type="submit">Enviar</button>
                    </div>
                </form>
                <a href="/register">Crie uma Conta</a>
            </section>
        </main>
    )
}

export default LoginPage