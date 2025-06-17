import '../../style/main.css';
import '../../assets/games_img/img_import'
import { useNavigate } from 'react-router-dom';

function Game({ img, title, price}){
    return(
        <a>
            <img src={img} className="games"/>
            <p>{title}</p>
            <p>{price}</p>
        </a>
    )
}

export default Game