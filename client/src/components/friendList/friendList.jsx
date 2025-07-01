import { useState } from "react";

function RecomendationBar({recomendations}){

    return(
        <div className="friends">
            {recomendations.map(recomm => <a href={`/game?title=${recomm.title}&id=${recomm.id}`}>{recomm.title}</a>)}
        </div>
    )
}

function FriendButton({friend}){
    const [ativo, setAtivo] = useState(false)
    const [recomms, setRecomms] = useState([])
    const TOKEN = localStorage.getItem('TOKEN')

    async function pega_recomendas(){
        let user_data = await fetch('/users/me', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`},
        })

        const user = await user_data.json();

        let newRecomms = []
        for (let a of user.friends) {
            let amigo_data = await fetch(`/users/${a.id}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            })

            const amigo = await amigo_data.json();
            if (amigo.username === friend.username){
                for (let r of a.recommendations) {
                    let game_data = await fetch(`/games/${r}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })

                    const game = await game_data.json();
                    newRecomms.push({id: game._id, title: game.name})
                }
            }
        }
        setRecomms(newRecomms)
    }

    return(
        <>
            <button onClick={()=>{ativo?setAtivo(false):setAtivo(true); pega_recomendas()}}>{friend.username}</button>
            {ativo ? <RecomendationBar recomendations={recomms}></RecomendationBar> : console.log('Fechando')}
        </>
    )
}

function SearchBarTag({type, onclick}){
    const TOKEN = localStorage.getItem('TOKEN')
    const adicionar_amigo = async () => {
        let amigo;
        let inputs = document.getElementsByClassName('input-friend')
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            amigo = input.value
        }
        const jsonData = JSON.stringify({friendName: amigo})
        let data_register = await fetch('/users/add/friend', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`
            },
            body: jsonData
        })

        const serverResponse = await data_register.json();
        onclick()
    }

    const remover_amigo = async () => {
        let amigo;
        let inputs = document.getElementsByClassName('input-friend')
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            amigo = input.value
        }
        const jsonData = JSON.stringify({friendName: amigo})
        let data_register = await fetch('/users/remove/friend', {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`
            },
            body: jsonData
        })

        const serverResponse = await data_register.json();
        onclick()
    }

    return(
        <div className="search-friend flex-container-column ">
            <form>
                <label htmlFor="">Escreva o nome do usuário</label>
                <input className="input-friend" type="text" />
            </form>
            {type ? (<button className="add-friend" onClick={adicionar_amigo}>Enviar</button>) : (<button className="delet-friend" onClick={remover_amigo}>Enviar</button>)}
        </div>
    )
}

function FriendList({onClose}){
    const TOKEN = localStorage.getItem('TOKEN')
    const [searchBar, setSearchBar] = useState(false)
    const [type, setType] = useState(false)
    const [amigos, setAmigos] = useState([])

    const mudarAmigos = async () => {
        let newAmigos = []
        let user_data = await fetch('/users/me', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`},
        })

        const user = await user_data.json();
        for (let a of user.friends) {
            let amigo_data = await fetch(`/users/${a.id}`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                }
            })

            const amigo = await amigo_data.json();
            newAmigos.push({username: amigo.username})
        }
        setAmigos(newAmigos)
    }

    return(
        <div className="background-friend" onLoad={mudarAmigos}>
            <div className="dark-translucid-background background-friend"></div>
            <div className="friend-div">
                <div className="friend-title">
                    <h2 >Lista de Amigos</h2>
                    <button><img src={"https://drive.google.com/thumbnail?id=1Sx5aQz1D0GSFGaKEk2-z18IkAC7hKlxC&sz=s800"} alt="exit_button" onClick={onClose}/></button>
                </div>
                <div className="options-friend">
                    <button className="add-friend" onClick={()=> {setSearchBar(true); setType(true)}}>Adicionar Amigo</button>
                    <button className="delet-friend" onClick={()=> {setSearchBar(true); setType(false)}}>Excluir Amigo</button>
                </div>
                {searchBar && <SearchBarTag type={type} onclick={mudarAmigos}/>}
                <div className="friends">
                    {amigos.map(amigo => <FriendButton friend={amigo}></FriendButton>)}
                </div>
            </div>
        </div>
    )
}

export default FriendList