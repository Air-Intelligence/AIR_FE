import { Outlet } from "react-router-dom";
import "../global.css";
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
    return (
        <main>
            <Outlet />
        </main>
    );
}

export default App;
