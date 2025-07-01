import { useNavigate } from 'react-router-dom';

export default function ProfileDropdown({style}) {
    const navigate = useNavigate()
    const TOKEN = localStorage.getItem('TOKEN')

    const logout = () => {
        localStorage.removeItem("TOKEN")
        navigate('/')
    }

    return (
        <>
            <a href={TOKEN ? '/edit' : '/'} >Editar Perfil</a>
            <a onClick={logout}>Logout</a>
        </>
    )
}