import {x_button} from "../../assets/games_img/img_import"
import { useState } from "react";

function SearchBarTag({type}){
    return(
        <div className="search-friend flex-container-column ">
            <form>
                <label htmlFor="">Escreva o nome do usuário</label>
                <input type="text" />
            </form>
            {type ? (<button className="add-friend">Enviar</button>) : (<button className="delet-friend">Enviar</button>)}
        </div>
    )
}

function FriendList({onClose}){
    const [searchBar, setSearchBar] = useState(false)
    const [type, setType] = useState(false)
    return(
        <div className="background-friend">
            <div className="dark-translucid-background background-friend"></div>
            <div className="friend-div">
                <div className="friend-title">
                    <h2 >Lista de Amigos</h2>
                    <button><img src={x_button} alt="exit_button" onClick={onClose}/></button>
                </div>
                <div className="options-friend">
                    <button className="add-friend" onClick={()=> {setSearchBar(true); setType(true)}}>Adicionar Amigo</button>
                    <button className="delet-friend" onClick={()=> {setSearchBar(true); setType(false)}}>Excluir Amigo</button>
                </div>
                {searchBar && <SearchBarTag type={type}/>}
                <div className="friends">
                    <button>Oi</button>
                    <button>Oi</button>
                    <button>Oi</button>
                </div>
            </div>
        </div>
    )
}

export default FriendList