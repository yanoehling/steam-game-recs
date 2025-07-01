import NavBar from "../../components/nav/nav"
import Slider from "../../components/slider/Slider"
import {useParams, useSearchParams} from 'react-router-dom'
import { useEffect, useState} from "react"
import FriendList from "../../components/friendList/friendList"
import RecomendationList from "../../components/friendList/recomendationList"
import Footer from "../../components/footer/footer"
import { useNavigate } from "react-router-dom"




function GamePage(){
    const [params] = useSearchParams()
    const [game, setGame] = useState(null)
    const [imgs, setImgs] = useState(null)
    const [showFriendList, setShowFriendList] = useState(false)
    const [showRecomendationList, setShowRecomendationList] = useState(false)
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('TOKEN')
    useEffect(() => {
        fetch(`http://localhost:5000/games/${params.get('id')}`)
        .then((response) => response.json())
        .then((response) =>setGame(response))
        .catch((error) => console.log(error))
    }, [params])

    const redirectLogin = () => {
        if (!TOKEN) {
        navigate('/')
        }
    }

    return(
    <>
    {game && (
        <>
        <main className="gap_game" onLoad={redirectLogin}>
            {showFriendList && (<FriendList onClose={()=> setShowFriendList(false)}/>)}
            {showRecomendationList && (<RecomendationList onClose={()=> setShowRecomendationList(false)} id={params.get('id')}/>)}
            <header>
                <NavBar showFriends={()=> setShowFriendList(true)}/>
            </header>
            <section className="game-promotion">
                {/* imagens, vídeo do jogo */}
                <div className="flex-container-column">
                    <Slider showcase_game_info={game.images} is_anchours={false} qt={2}/>
                </div>

                {/* Descrição, nota do jogo */}
                <div className="description_section gray-color">
                    <h1>{game.name}</h1>
                    <p><b>Nota: </b>{game.review}</p>
                    <div className="infos">
                        <p>{game.description}</p>
                        <p><b>Desenvolvedor: </b>{game.dev}</p>
                        <p>Categorias desse jogo:</p>
                        <div className="flex-container-column categories-container">
                            <ul className="categories">
                                {game.category.map((cat) => {
                                    return <li>{cat}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <div className="price-div-container">
                <div className="price-div gray-color">
                    <h2><b>{`Comprar ${game.name}`}</b></h2>
                    <button>{`R$ ${game.price}`}</button>
                </div>
                <div className="flex-container-row user_buttons">
                    <button className="gray-color">WishList</button>
                    <button className="gray-color" onClick={()=> setShowRecomendationList(true)}>Recomendar</button>
                </div>
            </div>
        </main>
        <Footer />
    </>
)}
</>
)
}

export default GamePage