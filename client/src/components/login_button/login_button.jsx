import '../../style/main.css';
import img_login from './Img_Perfil.png';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import ProfileDropdown from '../dropdown/ProfileDropdown';

function LoginButton(){
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('TOKEN');

    return (
        <>
            <div className="flex-container-row">
                {TOKEN ? <ProfileDropdown></ProfileDropdown> :<button onClick={()=>navigate('/')}><img src={img_login} alt="Img-Login" className="login-button"/></button>}
            </div>
        </>
    )
}

export default LoginButton