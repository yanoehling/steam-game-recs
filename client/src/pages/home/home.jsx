import '../../style/main.css';
import Slider from '../../components/slider/Slider.jsx'
import Game from '../../components/game/Game.jsx'
import LoginButton from '../../components/login_button/login_button.jsx';
import {gamesInfos} from '../../assets/games_img/img_import.js';
import NavBar from '../../components/nav/nav.jsx';
import hollowKnightBanner from './Hollow_Knight_Banner.png';
import undertaleBanner from './Undertale_banner.png';
import theLastOfUsBanner from './The_Last_Of_Us_Banner.png';

const showcaseInfo = [
  {id:1, img:undertaleBanner, href:'/game', name:'Undertale Banner'},
  {id:2, img:hollowKnightBanner, href:'/game', name:'Hollow Knight Banner'},
  {id:3, img:theLastOfUsBanner, href:'/game', name:'The Last Of Us Banner'}
]

function Home() {
  return (
    <main className="flex-container-column roboto">
      <header className="flex-container-column">
        <NavBar />
        <Slider showcase_game_info={showcaseInfo} is_anchours={true}></Slider>
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