import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Proctected from "./features/auth/components/Proctected";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: "/",
        element: <Proctected><h1>Home</h1></Proctected>
    }
])