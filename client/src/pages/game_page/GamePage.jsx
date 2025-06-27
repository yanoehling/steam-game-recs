
import NavBar from "../../components/nav/nav"
import {imagesPromote} from "../../assets/games_img/img_import"
import Slider from "../../components/slider/Slider"
import {useParams, useSearchParams} from 'react-router-dom'
import { useEffect, useState} from "react"





function GamePage(){
    const [params] = useSearchParams()
    const [game, setGame] = useState(null)
    useEffect(() => {
        fetch(`http://localhost:5000/games/${params.get('title')}`)
        .then((response) => response.json())
        .then((response) => setGame(response))
        .catch((error) => console.log(error))
    })

    return(
    <>
        <main className="flex-container-row">
            <header>
                <NavBar />
            </header>
            <section className="flex-container-row game-promotion">
                {/* imagens, vídeo do jogo */}
                <div className="flex-container-column">
                    <Slider showcase_game_info={imagesPromote[0].img} is_anchours={false} qt={2}/>
                </div>

                {/* Descrição, nota do jogo */}
                <div className="description_section gray-color">
                    <h1>{imagesPromote[0].name}</h1>
                    <p><b>Nota:</b>{imagesPromote[0].review}</p>
                    <div className="infos">
                        <p>{imagesPromote[0].description}</p>
                        <p><b>Desenvolvedor: </b>{imagesPromote[0].dev}</p>
                        <p>Categorias desse jogo:</p>
                        <div className="flex-container-column">
                            <ul className="categories">
                                {imagesPromote[0].category.map((cat) => {
                                    return <li>{cat}</li>
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <div className="price-div gray-color">
                    <h2><b>{`Comprar ${imagesPromote[0].name}`}</b></h2>
                    <button>{`R$ ${imagesPromote[0].price}`}</button>
                </div>
                <div className="flex-container-row user_buttons">
                    <button className="gray-color">WishList</button>
                    <button className="gray-color">Recomendar</button>
                </div>
            </div>
        </main>
    </>
)}

export default GamePage