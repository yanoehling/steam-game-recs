
import NavBar from "../../components/nav/nav"
import {imagesPromote} from "../../assets/games_img/img_import"
import Slider from "../../components/slider/Slider"

function GamePage(){
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
                    <h1>Undertale</h1>
                    <p><b>Nota:</b> 9,2/10</p>
                    <div className="infos">
                        <p>Undertale is a role-playing video game that uses a top-down perspective. In the game, the player controls a child and completes objectives in order to progress through the story. Players explore an underground world filled with towns and caves, and are required to solve numerous puzzles on their journey.</p>
                        <p><b>Desenvolvedor: </b>tobyfox</p>
                        <p>Categorias desse jogo:</p>
                        <div className="flex-container-column">
                            <ul className="categories">
                                <li>Trilha Sonora Boa</li>
                                <li>RPG</li>
                                <li>Boa Trama</li>
                                <li>Você decide</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <div>
                <div className="price-div gray-color">
                    <h2><b>Comprar Undertale</b></h2>
                    <button>R$ 19,99</button>
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