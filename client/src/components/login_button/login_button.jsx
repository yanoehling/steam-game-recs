import '../../style/main.css';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import ProfileDropdown from '../dropdown/ProfileDropdown';

function LoginButton(){
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const TOKEN = localStorage.getItem('TOKEN');

    return (
        <>
            <div className="flex-container-row ">
                {TOKEN ? <ProfileDropdown></ProfileDropdown> :<button className='login-button' onClick={()=>navigate('/')}><img src={"https://drive.google.com/thumbnail?id=1IsKu2sJMtoegJrU9eadGVHxbEtaoi6Pg&sz=s800"} alt="Img-Login" className="login-button-img"/></button>}
            </div>
        </>
    )
}

export default LoginButton