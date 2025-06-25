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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReferLinkPage from "./pages/dashboard/user/Referals/ReferalsLink.jsx";
import MyReferrals from "./pages/dashboard/user/Referals/MyReferrals.jsx";
import MyTeam from "./pages/dashboard/user/Referals/MyTeam.jsx";
import Transactions from "./pages/dashboard/user/wallet/Transactions.jsx";
import TodayStatement from "./pages/dashboard/SuperAdmin/TodayStatement.jsx";
import CommissionStatement from "./pages/dashboard/SuperAdmin/CommisionStatement.jsx";
import Withdraw from "./pages/dashboard/SuperAdmin/Withdrow.jsx";
import MyOrder from "./pages/dashboard/SuperAdmin/MyOrder.jsx";
import Voucher from "./pages/dashboard/SuperAdmin/Voucher.jsx";
import MyConsistency from "./pages/dashboard/SuperAdmin/MyConsistency.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import PackegForActive from "./pages/packeg/PackegForActive.jsx";

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
      { path: "/packages", element: <PackegForActive /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { path: "/dashboard/CashonDelivery", element: <Orders /> },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/packages", element: <PackegForActive /> },
      { path: "/dashboard/leaderboard", element: <FontDashboard /> },
      { path: "/dashboard/refer-link", element: <ReferLinkPage /> },
      { path: "/dashboard/my-team", element: <MyTeam /> },
      { path: "/dashboard/my-refer", element: <MyReferrals /> },
      { path: "/dashboard/transactions", element: <Transactions /> },
      { path: "/dashboard/register", element: <Register /> },
      { path: "/dashboard/today-statement", element: <TodayStatement /> },
      {
        path: "/dashboard/commission-statement",
        element: <CommissionStatement />,
      },
      { path: "/dashboard/withdraw", element: <Withdraw /> },
      { path: "/dashboard/my-order", element: <MyOrder /> },
      { path: "/dashboard/voucher", element: <Voucher /> },
      { path: "/dashboard/my-consistency", element: <MyConsistency /> },
    ],
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClients}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
