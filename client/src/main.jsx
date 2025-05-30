import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import PageNotFound from './pages/PageNotFound.jsx';
import Header from './components/Header.jsx';
import Footer from './pages/Footer.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Management from './pages/Management.jsx';
import CoreValue from './pages/CoreValue.jsx';

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "/about-us", element: <AboutUs /> },
      { path: "/management", element: <Management /> },
      { path: "/core-value", element: <CoreValue /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
