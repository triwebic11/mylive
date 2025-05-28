import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import PageNotFound from './pages/PageNotFound.jsx';
import Header from './components/Header.jsx';

const Layout = () => {
  return (
    <div>

      <Header />
      <Outlet />

    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <App /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
