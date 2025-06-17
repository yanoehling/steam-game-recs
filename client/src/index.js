import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App.jsx';
import './style/main.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GamePage from "./pages/game_page/GamePage.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/game",
        element: <GamePage />
    }
])

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)