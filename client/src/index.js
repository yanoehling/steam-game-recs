import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App.jsx';
import './style/main.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./pages/game_page/GamePage.jsx"
import LoginPage from "./pages/login_page/LoginPage.jsx";
import RegisterPage from "./pages/register_page/RegisterPage.jsx";
import EditProfilePage from "./pages/edit_profile_page/EditProfilePage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/game/",
        element: <GamePage />
    },
    {
        path: '/home',
        element: <App />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },
    {
        path: '/edit',
        element: <EditProfilePage />
    },
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)