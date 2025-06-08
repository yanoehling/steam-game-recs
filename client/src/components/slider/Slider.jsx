import '../../style/main.css';
import undertale_banner from './Undertale_banner.png';
import hollowKnight_banner from './Hollow_Knight_Banner.png';
import lastOfUs_banner from './The_Last_Of_Us_Banner.png'
let qt = 2;
let count = 0;
let intervalId;

function slider_loop(){
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

function slider_pass_next(){
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

function slider_pass_before(){
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

function Slider(){
  slider_loop()
  return(
    <>
      <section className='showcase-game'>
        <div className="showcase-div" id="slider">
          <a href='#'><img src={undertale_banner} alt="Undertale Banner"/></a>
          <a href="#"><img src={hollowKnight_banner} alt="Hollow Knight Banner"/></a>
          <a href="#"><img src={lastOfUs_banner} alt="The Last Of Us Banner"/></a>
        </div>
        <button className="btn back-btn" onClick={slider_pass_before}></button>
        <button className="btn next-btn" onClick={slider_pass_next}></button>
      </section>
    </>
  )
}

export default Slider