import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../../page/home/HomePage";
import { TestPage } from "../../page/test/TestPage";
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
                    path: "test",
                    element: <TestPage />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
};
