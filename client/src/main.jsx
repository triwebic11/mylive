import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Header from "./components/Header.jsx";
import Footer from "./pages/Footer.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Management from "./pages/Management.jsx";
import CoreValue from "./pages/CoreValue.jsx";
import AuthProvider from "./AuthProvider/AuthProvider.jsx";
import CashOnDelivery from "./pages/dashboard/SuperAdmin/CashOnDelivery.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Profile from "./pages/dashboard/user/Profile.jsx";
import FontDashboard from "./pages/dashboard/SuperAdmin/FontDashboard.jsx";
import Orders from "./pages/dashboard/SuperAdmin/Orders.jsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReferLinkPage from "./pages/dashboard/user/Referals/ReferalsLink.jsx";

const queryClients = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname === "/register" || location.pathname === "/login";



  return (
    <div className="bg-gray-100">
      {!noHeaderFooter && <Header />}
      <Outlet />
      {!noHeaderFooter && <Footer />}
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
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/productdetails/:id", element: <ProductDetails /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "/dashboard/CashonDelivery", element: <Orders /> },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/fontDashboard", element: <FontDashboard /> },
      { path: "/dashboard/refer-link", element: <ReferLinkPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClients}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
