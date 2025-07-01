import '../../style/main.css';

function Game({ img, title, price, id}){
    return(
        <a href={`/game?title=${title}&id=${id}`}>
            <img src={img.img} alt={img.name} className="games"/>
            <p>{title}</p>
            <p>R${price}</p>
        </a>
    )
}

export default Game
