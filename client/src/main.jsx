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
import Withdraw from "./pages/dashboard/user/Withdorw.jsx";
import MyOrder from "./pages/dashboard/SuperAdmin/MyOrder.jsx";
import Voucher from "./pages/dashboard/SuperAdmin/Voucher.jsx";
import MyConsistency from "./pages/dashboard/SuperAdmin/MyConsistency.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import PackegForActive from "./pages/packeg/PackegForActive.jsx";
import UpdatePassword from "./components/UpdatePassword.jsx";
import UserDetails from "./components/UserDetails.jsx";
import AllUsers from "./pages/admin/AllUsers.jsx";
import AddProduct from "./pages/dashboard/Admin/AddProduct.jsx";
import PackageUpdate from "./pages/dashboard/Admin/PackageUpdate.jsx";
import UpdatePackages from "./pages/dashboard/Admin/UpdatePackages.jsx";
import AdminWithdrawRequests from "./components/AdminWithdrawRequests.jsx";
import AllProducts from "./pages/dashboard/Admin/AllProducts.jsx";
import BalanceConversion from "./components/BalanceConversion.jsx";
import AdminConversionRateForm from "./components/AdminConversionRateForm.jsx";
import AdminPackageRequests from "./pages/dashboard/Admin/AdminPackageRequests.jsx";
import PackageWaitingPage from "./components/PackageWaitingPage.jsx";

const queryClients = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/packeg-active" ||
    location.pathname === "/package-waiting";
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
      { path: "/packeg-active", element: <PackegForActive /> },
      { path: "/package-waiting", element: <PackageWaitingPage /> },
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
      { index: true, element: <FontDashboard /> },
      {
        path: "/dashboard/leaderboard",
        index: true,
        element: <FontDashboard />,
      },
      { path: "/dashboard/CashonDelivery", element: <Orders /> },
      { path: "/dashboard/profile", element: <Profile /> },
      { path: "/dashboard/packages", element: <PackageUpdate /> },
      { path: "/dashboard/allProducts", element: <AllProducts /> },
      { path: "/dashboard/updatePackages", element: <UpdatePackages /> },
      { path: "/dashboard/refer-link", element: <ReferLinkPage /> },
      { path: "/dashboard/my-team", element: <MyTeam /> },
      { path: "/dashboard/my-refer", element: <MyReferrals /> },
      { path: "/dashboard/transactions", element: <Transactions /> },
      { path: "/dashboard/register", element: <Register /> },

      { path: "/dashboard/today-statement", element: <TodayStatement /> },
      { path: "/dashboard/update-password", element: <UpdatePassword /> },
      {
        path: "/dashboard/commission-statement",
        element: <CommissionStatement />,
      },
      { path: "/dashboard/withdraw", element: <Withdraw /> },
      { path: "/dashboard/my-order", element: <MyOrder /> },
      { path: "/dashboard/voucher", element: <Voucher /> },
      { path: "/dashboard/my-consistency", element: <MyConsistency /> },
      { path: "/dashboard/AddProduct", element: <AddProduct /> },
      // {
      //   path: "/dashboard",
      //   element: <AdminDashboard />,
      // },
      {
        path: "/dashboard/user/:id",
        element: <UserDetails />,
      },
      { path: "/dashboard/allUsers", element: <AllUsers /> },
      {
        path: "/dashboard/allPackageRequestUser",
        element: <AdminPackageRequests />,
      },
      {
        path: "/dashboard/allWithdrawals",
        element: <AdminWithdrawRequests />,
      },
      {
        path: "/dashboard/balanceConversion",
        element: <AdminConversionRateForm />,
      },
    ],
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
