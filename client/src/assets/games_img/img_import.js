import eldenRing_Banner from "./Elden_Ring_banner.png";
import expedition33_Banner from "./Expedition33_banner.png";
import REPO_Banner from "./REPO_banner.png";
import spiderMan_Banner from "./Spider_Man_2_banner.png";
import undertale_img from "./Undertale_img_1.jpg";
import undertale_img2 from "./Undertale_img_2.jpg";
import undertale_img3 from "./Undertale_img_3.jpg"
import x_button from "./x_button.png"

export {x_button}

export const gamesInfos = [
    {id: 1, img: eldenRing_Banner, title: "Elden Ring", price: "R$274,50"},
    {id: 2, img: expedition33_Banner, title: "Expedition 33", price: "R$199,00"},
    {id: 3, img: REPO_Banner, title: "REPO", price:"R$32,99"},
    {id: 4, img: spiderMan_Banner, title: "Marvel Spider-Man 2", price: "R$249,90"}
] ;

export const imagesPromote = [
    {name:"Undertale", 
        img:[{img: undertale_img, nome: "Undertale_Image_1"}, {img: undertale_img2, nome: "Undertale_Image_2"}, {img: undertale_img3, nome: "Undertale_Image_3"}], 
        review: "9,2/10", 
        description:"Undertale é um role-play game que utiliza uma perspectiva de cima para baixo. No jogo, o jogador controla uma criança e cumpre objetivos para avançar na história. Os jogadores exploram um mundo subterrâneo repleto de cidades e cavernas, e precisam resolver diversos quebra-cabeças em sua jornada",
        dev: "tobyfox",
        category: ["Trilha Sonora Boa", "RPG", "Boa Trama", "Você Decide"],
        price: 19.99
    }
]

