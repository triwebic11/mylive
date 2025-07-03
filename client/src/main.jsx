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
import PrivetRouter from "./Routes/PrivetRoutes.jsx";
import AdminRoute from "./Routes/AdminRoute.jsx";

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
        element: <PrivetRouter><FontDashboard /></PrivetRouter>,
      },

      // admin Routes
      { path: "/dashboard/CashonDelivery", element: <PrivetRouter><AdminRoute><Orders /></AdminRoute></PrivetRouter> },
      { path: "/dashboard/packages", element: <PrivetRouter><AdminRoute><PackageUpdate /></AdminRoute></PrivetRouter> },
      { path: "/dashboard/allProducts", element: <PrivetRouter><AdminRoute><AllProducts /></AdminRoute></PrivetRouter> },
      { path: "/dashboard/updatePackages", element: <PrivetRouter><AdminRoute><UpdatePackages /></AdminRoute></PrivetRouter> },
      { path: "/dashboard/update-password", element: <PrivetRouter><AdminRoute><UpdatePassword /></AdminRoute></PrivetRouter> },
      { path: "/dashboard/allUsers", element: <PrivetRouter><AdminRoute><AllUsers /></AdminRoute></PrivetRouter> },
      {
        path: "/dashboard/allPackageRequestUser",
        element: <PrivetRouter><AdminRoute><AdminPackageRequests /></AdminRoute></PrivetRouter>,
      },
      {
        path: "/dashboard/allWithdrawals",
        element: <PrivetRouter><AdminRoute><AdminWithdrawRequests /></AdminRoute></PrivetRouter>,
      },
      {
        path: "/dashboard/balanceConversion",
        element: <PrivetRouter><AdminRoute><AdminConversionRateForm /></AdminRoute></PrivetRouter>,
      },
       { path: "/dashboard/AddProduct", element: <PrivetRouter><AdminRoute><AddProduct /></AdminRoute></PrivetRouter> },


      // user routessss
      { path: "/dashboard/profile", element: <PrivetRouter><Profile /></PrivetRouter> },
      { path: "/dashboard/refer-link", element: <PrivetRouter><ReferLinkPage /></PrivetRouter> },
      { path: "/dashboard/my-team", element: <PrivetRouter><MyTeam /></PrivetRouter> },
      { path: "/dashboard/my-refer", element: <PrivetRouter><MyReferrals /></PrivetRouter> },
      { path: "/dashboard/transactions", element: <PrivetRouter><Transactions /></PrivetRouter> },
      { path: "/dashboard/register", element: <PrivetRouter><Register /></PrivetRouter> },

      { path: "/dashboard/today-statement", element: <PrivetRouter><TodayStatement /></PrivetRouter> },
      {
        path: "/dashboard/commission-statement",
        element: <PrivetRouter><CommissionStatement /></PrivetRouter>,
      },
      { path: "/dashboard/withdraw", element: <PrivetRouter><Withdraw /></PrivetRouter> },
      { path: "/dashboard/my-order", element: <PrivetRouter><MyOrder /></PrivetRouter> },
      { path: "/dashboard/voucher", element: <PrivetRouter><Voucher /></PrivetRouter> },
      { path: "/dashboard/my-consistency", element: <PrivetRouter><MyConsistency /></PrivetRouter> },
     
      // {
      //   path: "/dashboard",
      //   element: <AdminDashboard />,
      // },
      {
        path: "/dashboard/user/:id",
        element: <PrivetRouter><UserDetails /></PrivetRouter>,
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
