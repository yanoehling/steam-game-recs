import '../../style/main.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
let count = 0;
let intervalId;


function Showcase_imgs(showcase_game_info, is_anchours){
  return (
    <>
      {showcase_game_info.map((showcase)=> (
        is_anchours ? (<a href={showcase.href}>
          <img src={showcase.img} alt={showcase.name}/>
        </a>) : (<img src={showcase.img} alt={showcase.name}/>)
      ))}
    </>
  );
}
function Slider({showcase_game_info, is_anchours, qt}){

  useEffect(() => {
    slider_loop(qt);
    return () => clearInterval(intervalId);
  }, [qt]);

  useEffect(() => {
    slider_loop();
    return () => clearInterval(intervalId);
  }, []);

  const slider_loop = () => {
    clearInterval(intervalId)
    intervalId = setInterval(()=>{
      count++
      if(count > qt){
          count = 0
      }
      const slider = document.getElementById('slider')
      let marginpercent = 200*count;
      slider.style.marginLeft = `-${marginpercent}%`;
      slider.style.transition = "1s";
  }, 3000)
  }

  const slider_pass_next = () => {
    clearInterval(intervalId)
    count++
    if (count > qt){
      count = 0
    }
    const slider = document.getElementById('slider')
    let marginpercent = 200*count;
    slider.style.marginLeft = `-${marginpercent}%`;
    slider.style.transition = "1s";
    setTimeout(slider_loop, 5000)
  }

  const slider_pass_before = () => {
    clearInterval(intervalId)
    count--
    if (count < 0){
      count = qt
    }
    const slider = document.getElementById('slider')
    let marginpercent = 200*count;
    slider.style.marginLeft = `-${marginpercent}%`;
    slider.style.transition = "1s";
    setTimeout(slider_loop, 5000)
  }
  
  return(
    <>
      <section className='showcase-game'>
        <div className="showcase-div" id="slider">
          {Showcase_imgs(showcase_game_info, is_anchours)}
        </div>
        <button className="btn back-btn" onClick={slider_pass_before}></button>
        <button className="btn next-btn" onClick={slider_pass_next}></button>
      </section>
    </>
  )
}

export default Slider