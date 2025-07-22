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
import MyOrder from "./pages/dashboard/user/MyOrder.jsx";
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
import UserRoute from "./Routes/UserRoute.jsx";
import Kyc from "./pages/dashboard/user/Kyc.jsx";
import Support from "./pages/dashboard/user/Support.jsx";
import SocialLink from "./pages/SocialLink.jsx";
import AdminKycList from "./components/AdminKycList.jsx";
import OurProducts from "./components/OurProducts.jsx";

import DspRoute from "./Routes/DspRoute.jsx";
import AllOrders from "./pages/dashboard/DSP/AllOrders.jsx";
import DspOrder from "./pages/dashboard/DSP/DspOrder.jsx";
import DspProfile from "./pages/dashboard/DSP/DspProfile.jsx";
import MyDspOrders from "./pages/dashboard/DSP/MyDspOrders.jsx";
import DspAllOrders from "./pages/dashboard/Admin/DspAllOrders.jsx";
import MyOrders from "./pages/dashboard/user/MyOrder.jsx";
import CreateDspOrder from "./pages/dashboard/Admin/CreateDspOrder.jsx";
import OrderAproved from "./pages/dashboard/DSP/OrderAproved.jsx";
import OrderToDsp from "./pages/dashboard/user/OrderToDsp.jsx";
import CreateUserOrder from "./pages/dashboard/DSP/CreateUserOrder.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";

const queryClients = new QueryClient();

const Layout = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname === "/register" ||
    location.pathname === "/login" ||
    location.pathname === "/packeg-active" ||
    location.pathname === "/package-waiting" ||
    location.pathname === "/forgot-password";
  return (
    <div className="bg-gray-100">
      {!noHeaderFooter && <Header />}
      <Outlet />
      {!noHeaderFooter && <Footer />}
      {!noHeaderFooter && <SocialLink />}
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
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/productdetails/:id", element: <ProductDetails /> },
      { path: "/packages", element: <PackegForActive /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    children: [
      // { index: true, element: <FontDashboard /> },
      {
        path: "/dashboard/leaderboard",
        index: true,
        element: (
          <PrivetRouter>
            <FontDashboard />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/leaderboardAdmin",
        index: true,
        element: (
          <PrivetRouter>
            <FontDashboard />
          </PrivetRouter>
        ),
      },

      // --------admin Routes---------
      {
        path: "/dashboard/CashonDelivery",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <Orders />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/packages",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <PackageUpdate />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/allProducts",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AllProducts />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/updatePackages",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <UpdatePackages />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/update-password",
        element: (
          <PrivetRouter>
            <UpdatePassword />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/allUsers",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AllUsers />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/createOrder",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <CreateDspOrder />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/allDspOrders",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <DspAllOrders />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/allPackageRequestUser",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AdminPackageRequests />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/allWithdrawals",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AdminWithdrawRequests />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/balanceConversion",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AdminConversionRateForm />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/AddProduct",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/user/:id",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <UserDetails />
            </AdminRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/kycVerified",
        element: (
          <PrivetRouter>
            <AdminRoute>
              <AdminKycList />
            </AdminRoute>
          </PrivetRouter>
        ),
      },

      //-------- dsp routessss--------
      {
        path: "/dashboard/allOrders",
        element: (
          <PrivetRouter>
            <DspRoute>
              <AllOrders />
            </DspRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/dspprofile",
        element: (
          <PrivetRouter>
            <DspRoute>
              <DspProfile />
            </DspRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/orderFroUser",
        element: (
          <PrivetRouter>
            <DspRoute>
              <CreateUserOrder />
            </DspRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/dspOrder",
        element: (
          <PrivetRouter>
            <DspRoute>
              <DspOrder />
            </DspRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/myAprovedOrders",
        element: (
          <PrivetRouter>
            <DspRoute>
              <OrderAproved />
            </DspRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/myOrders",
        element: (
          <PrivetRouter>
            <DspRoute>
              <MyDspOrders />
            </DspRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/kyc",
        element: (
          <PrivetRouter>
            <Kyc />
          </PrivetRouter>
        ),
      },

      //-------- user routessss--------
      {
        path: "/dashboard/marketPlace",
        element: (
          <PrivetRouter>
            <UserRoute>
              <OurProducts />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/userPackages",
        element: (
          <PrivetRouter>
            <UserRoute>
              <PackageUpdate />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <PrivetRouter>
            <UserRoute>
              <Profile />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/refer-link",
        element: (
          <PrivetRouter>
            <UserRoute>
              <ReferLinkPage />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/my-team",
        element: (
          <PrivetRouter>
            <UserRoute>
              <MyTeam />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/my-refer",
        element: (
          <PrivetRouter>
            <UserRoute>
              <MyReferrals />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/transactions",
        element: (
          <PrivetRouter>
            <UserRoute>
              <Transactions />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/register",
        element: (
          <PrivetRouter>
            <UserRoute>
              <Register />
            </UserRoute>
          </PrivetRouter>
        ),
      },

      {
        path: "/dashboard/today-statement",
        element: (
          <PrivetRouter>
            <UserRoute>
              <TodayStatement />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/commission-statement",
        element: (
          <PrivetRouter>
            <UserRoute>
              <CommissionStatement />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/withdraw",
        element: (
          <PrivetRouter>
            <UserRoute>
              <Withdraw />
            </UserRoute>
          </PrivetRouter>
        ),
      },

      {
        path: "/dashboard/my-order",
        element: (
          <PrivetRouter>
            <UserRoute>
              <MyOrder />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/voucher",
        element: (
          <PrivetRouter>
            <UserRoute>
              <MyOrders />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/kyc",
        element: (
          <PrivetRouter>
            <Kyc />
          </PrivetRouter>
        ),
      },

      {
        path: "/dashboard/support",
        element: (
          <PrivetRouter>
            <UserRoute>
              <Support />
            </UserRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/my-consistency",
        element: (
          <PrivetRouter>
            <UserRoute>
              <MyConsistency />
            </UserRoute>
          </PrivetRouter>
        ),
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
