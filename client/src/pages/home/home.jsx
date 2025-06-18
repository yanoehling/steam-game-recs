import '../../style/main.css';
import Slider from '../../components/slider/Slider.jsx'
import Game from '../../components/game/Game.jsx'
import LoginButton from '../../components/login_button/login_button.jsx';
import {gamesInfos} from '../../assets/games_img/img_import.js';

function Home() {
  return (
    <main className="flex-container-column roboto">
      <header className="flex-container-column">
        <nav className="gray-color">
          <div className="flex-container-row roboto">
            <a href="/">LOGO</a>
            <a href="#">Loja</a>
            <a href="#">Suporte</a>
            <a href="">Conversa</a>
          </div>
          <LoginButton />
        </nav>
        <Slider></Slider>
      </header>
      <section className="game-list-horizontal">
        <h2>Jogos do Momento</h2>
        <div className="games-horizontal">
          {gamesInfos.map((game) =>
          <Game 
          title={game.title}
          img={game.img}
          price={game.price}
          />)}
        </div>
      </section>
    </main>
  );
}

export default Home;