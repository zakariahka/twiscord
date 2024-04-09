import {useContext} from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Root from "./pages/Root";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import MainPage from "./pages/MainPage";
import { UserContext, UserProvider } from "./context/userContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useContext(UserContext);
  return isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
      {
        path: "forgotpassword",
        element: <ForgotPasswordPage />,
      },
      {
        path: "/", 
        element: <ProtectedRoute />,
        children: [
          {
            path: "main",
            element: <MainPage />,
          },
        ],
      },
      {
        index: true,
        element: <Navigate to="/main" replace />,
      },
    ],
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
