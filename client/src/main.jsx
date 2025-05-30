import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import PageNotFound from './pages/PageNotFound.jsx';
import Header from './components/Header.jsx';
import Footer from './pages/Footer.jsx';
<<<<<<< HEAD
import AboutUs from './pages/AboutUs.jsx';
import Management from './pages/Management.jsx';
import CoreValue from './pages/CoreValue.jsx';
=======
import Register from './pages/Register.jsx';
import AuthProvider from './AuthProvider/AuthProvider.jsx';
import Login from './pages/Login.jsx';
>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7

const Layout = () => {
  const location = useLocation()
  const path = location.pathname === "/register" || location.pathname === "/login"
  return (
<<<<<<< HEAD
    <div>
      <Header />
=======
    <div className='bg-gray-100'>

      {
        path || <Header />
      }


>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7
      <Outlet />
      {
        path || <Footer />
      }
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
<<<<<<< HEAD
      { path: "/about-us", element: <AboutUs /> },
      { path: "/management", element: <Management /> },
      { path: "/core-value", element: <CoreValue /> },
=======
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
>>>>>>> 8340af2e97f3a451d75824472252ce53494944b7
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
