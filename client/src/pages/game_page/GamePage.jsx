
import NavBar from "../../components/nav/nav"
import {imagesPromote} from "../../assets/games_img/img_import"
import Slider from "../../components/slider/Slider"
import {useParams, useSearchParams} from 'react-router-dom'
import { useEffect, useState} from "react"
import FriendList from "../../components/friendList/friendList"
import Footer from "../../components/footer/footer"




function GamePage(){
    const [params] = useSearchParams()
    const [game, setGame] = useState(null)
    const [imgs, setImgs] = useState(null)
    const [showFriendList, setShowFriendList] = useState(false)
    useEffect(() => {
        fetch(`http://localhost:5000/games/${params.get('id')}`)
        .then((response) => response.json())
        .then((response) =>setGame(response))
        .catch((error) => console.log(error))
    }, [params])
    return(
    <>
    {game && (
        <>
        <main className="gap_game">
            {showFriendList && (<FriendList onClose={()=> setShowFriendList(false)}/>)}
            <header>
                <NavBar showFriends={()=> setShowFriendList(true)}/>
            </header>
            <section className="flex-container-row game-promotion">
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
            <div>
                <div className="price-div gray-color">
                    <h2><b>{`Comprar ${game.name}`}</b></h2>
                    <button>{`R$ ${game.price}`}</button>
                </div>
                <div className="flex-container-row user_buttons">
                    <button className="gray-color">WishList</button>
                    <button className="gray-color" onClick={()=> setShowFriendList(true)}>Recomendar</button>
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