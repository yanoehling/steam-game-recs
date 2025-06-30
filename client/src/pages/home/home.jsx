import '../../style/main.css';
import Slider from '../../components/slider/Slider.jsx'
import Game from '../../components/game/Game.jsx'
import LoginButton from '../../components/login_button/login_button.jsx';
import {gamesInfos} from '../../assets/games_img/img_import.js';
import NavBar from '../../components/nav/nav.jsx';
import hollowKnightBanner from './Hollow_Knight_Banner.png';
import undertaleBanner from './Undertale_banner.png';
import theLastOfUsBanner from './The_Last_Of_Us_Banner.png';
import FriendList from '../../components/friendList/friendList.jsx';
import { useEffect, useState } from 'react';
import Footer from '../../components/footer/footer.jsx';
import { useSearchParams } from 'react-router-dom';



const showcaseInfo = [
  {id:1, img:undertaleBanner, href:`/game?title=Undertale&id=685d9527a24a6417a51e8d63`, name:'Undertale Banner'},
  {id:2, img:hollowKnightBanner, href:'/game?title=HollowKnight&id=685d9527a24a6417a51e8d64', name:'Hollow Knight Banner'},
  {id:3, img:theLastOfUsBanner, href:'/game?title="TheLastOfUs&id=685d9527a24a6417a51e8d65', name:'The Last Of Us Banner'}
]

function Home() {
  const [game, setGame] = useState(null)
  const [params] = useSearchParams()
  useEffect(() => {
          fetch(`http://localhost:5000/games/`)
          .then((response) => response.json())
          .then((response) =>setGame(response))
          .catch((error) => console.log(error))
      }, [params])
    
  const TOKEN = localStorage.getItem("TOKEN")
  const [showFriendList, setShowFriendList] = useState(false)
  function slide(direction){
    const slider = document.querySelector(".games-horizontal")
    let currentmargin = parseInt(slider.style.marginLeft) || 0
    const margin = 100;
    if((currentmargin >= -800) && (!direction)){
      slider.style.marginLeft = `${currentmargin-margin}px`;
      slider.style.transition = "1s";
    }else if((currentmargin <= 0) && (direction)){
      slider.style.marginLeft = `${currentmargin+margin}px`;
      slider.style.transition = "1s";      
    }

  }

  const showFriends = () => {
    if(TOKEN){
      setShowFriendList(true)
    }

  }
  return (
    <>
    {game &&(<>
    <main className="roboto">
      {showFriendList && (
        <FriendList onClose={() => setShowFriendList(false)}/>
      )}
      <header className="flex-container-column">
        <NavBar showFriends={showFriends}/>
        <Slider showcase_game_info={showcaseInfo} is_anchours={true} qt="2"></Slider>
      </header>
      <section className="game-list-horizontal">
        <h2>Jogos do Momento</h2>
          <button className='btn2 back-btn2' onClick={()=> slide(true)}></button> 
          <button className='btn2 next-btn2' onClick={()=> slide(false)}></button>
        <div className="container-game-list">
          <div className="games-horizontal">
            {game.map((game) =>
            <Game 
            title={game.name}
            img={game.images[0].img}
            price={game.price}
            id={game._id}
            />)}
          </div>
        </div>
      </section>
    </main>
    <Footer />
    </>)}
    </>
  );
}

export default Home;

