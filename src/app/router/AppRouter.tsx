import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../../page/home/HomePage";
import { WelcomePage } from "../../page/welcome/WelcomePage";
import App from "../App";

export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <App />,
            children: [
                {
                    path: "",
                    element: <HomePage />,
                },
                {
                    path: "welcome",
                    element: <WelcomePage />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};
