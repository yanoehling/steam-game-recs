import { useState } from "react";
import { apiUrl } from './App.test.js';

function FriendButton({friend, id, type}){
    const TOKEN = localStorage.getItem('TOKEN')

    async function add_recomendas(){
        let user_data = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`}
        })

        const user = await user_data.json();

        for (let a of user.friends) {
            let amigo_data = await fetch(`${apiUrl}/users/${a.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const amigo = await amigo_data.json();
            if (amigo.username === friend.username){
                let recomendacao_data = await fetch(`${apiUrl}/users/add/recommendation`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${TOKEN}`
                    },
                    body: JSON.stringify({friendName: amigo.username, recommendation: id})
                })
                console.log('Recomendado')
            }
        }
    }

    async function remove_recomendas(){
        let user_data = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`}
        })

        const user = await user_data.json();

        for (let a of user.friends) {
            let amigo_data = await fetch(`${apiUrl}/users/${a.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const amigo = await amigo_data.json();
            if (amigo.username === friend.username){
                let recomendacao_data = await fetch(`${apiUrl}/users/remove/recommendation`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${TOKEN}`
                    },
                    body: JSON.stringify({friendName: amigo.username, recommendation: id})
                })
                console.log('Desrecomendado')
            }
        }
    }

    return(
        <>
            <button onClick={()=>{type?add_recomendas():remove_recomendas()}}>{friend.username}</button>
        </>
    )
}

export default function RecomendationList({onClose, id}){
    const TOKEN = localStorage.getItem('TOKEN')
    const [type, setType] = useState(true)
    const [amigos, setAmigos] = useState([])

    const mudarAmigos = async () => {
        let newAmigos = []
        let user_data = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${TOKEN}`},
        })

        const user = await user_data.json();
        for (let a of user.friends) {
            let amigo_data = await fetch(`${apiUrl}/users/${a.id}`, {
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
                    <button className="add-friend" onClick={()=> {setType(true)}}>Adicionar Recomendação</button>
                    <button className="delet-friend" onClick={()=> {setType(false)}}>Excluir Recomendação</button>
                </div>
                <div className="friends">
                    {amigos.map(amigo => <FriendButton friend={amigo} id={id} type={type}></FriendButton>)}
                </div>
            </div>
        </div>
    )
}