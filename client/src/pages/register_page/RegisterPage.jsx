import '../../style/main.css';
import NavBar from '../../components/nav/nav.jsx';
import React, { useState } from "react";
import Campo from '../../components/campos/Campo'
import CampoSenhas from '../../components/campos/CampoSenhas';

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
            <header>
                <NavBar />
            </header>
            <section className="login-menu gray-color flex-container-column">
                <h2 style={{marginBottom: '20px'}}>Faça sua Conta</h2>
                <form action="" className="asap">
                    <Campo index={0} label='Escreva seu nome completo:' tipo="text" name="Nome" onblur={validaEmBranco}/>
                    <Campo index={1} label='Escreva um nome para seu usuário:' tipo='text' name='Usuário' onblur={validaEmBranco}/>
                    <Campo index={2} label='Insira sua data de nascimento:' tipo='date' name='Data de nascimento' onblur={validaEmBranco}/>
                    <Campo index={3} label='Escreva seu e-mail:' tipo='email' name='E-mail' onblur={validaEmail}/>
                    <CampoSenhas index1={4} index={5} validaTexto={validaEmBranco} validaSenha={validaSenha}/>
                    <div className="flex-container-row">
                        <button type='button'>Enviar</button>
                    </div>
                    
                </form>
            </section>
        </main>
    )
}