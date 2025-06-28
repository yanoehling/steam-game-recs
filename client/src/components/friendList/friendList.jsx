import {x_button} from "../../assets/games_img/img_import"
import { useState } from "react";


function FriendList({onClose}){

    return(
        <div className="background-friend">
            <div className="dark-translucid-background background-friend"></div>
            <div className="friend-div">
                <div className="friend-title">
                    <h2 >Lista de Amigos</h2>
                    <button><img src={x_button} alt="exit_button" onClick={onClose}/></button>
                </div>
                
                <div className="options-friend">
                    <button className="add-friend">Adicionar Amigo</button>
                    <button className="delet-friend">Excluir Amigo</button>
                </div>
                <div className="friends">
                    <button>Oi</button>
                </div>
            </div>
        </div>
    )
}

export default FriendList