import '../../style/main.css';
import img_login from './Img_Perfil.png';
import { useNavigate } from 'react-router-dom';

function LoginButton(){
    return (
        <>
            <div className="flex-container-row">
                <a href="/"><img src={img_login} alt="Img-Login" style={{height: '50px'}}/></a>
            </div>
        </>
    )
}

export default LoginButton