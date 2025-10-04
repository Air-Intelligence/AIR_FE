import { Outlet } from "react-router-dom";
import "../global.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useWebPush } from "../hooks/useWebPush";

function App() {
    useWebPush(import.meta.env.VITE_VAPID_PUBLIC_KEY);
    return (
        <main>
            <Outlet />
        </main>
    );
}

export default App;
