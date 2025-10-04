import { Outlet } from "react-router-dom";
import "../global.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useWebPush } from "../hooks/useWebPush";
import { useCreateUser } from "../hooks/useCreateUser";

function App() {
    useCreateUser();
    useWebPush(import.meta.env.VITE_VAPID_PUBLIC_KEY);
    return (
        <main>
            <Outlet />
        </main>
    );
}

export default App;
