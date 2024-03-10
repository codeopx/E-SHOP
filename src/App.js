import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Shop from "./pages/shop";
import Login from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import AdminLogin from "./pages/admin/loginAdmin";
import AdminDashboard from "./pages/admin/dashboardAdmin";
import { AuthContextProvider } from "./context/authContext";
import ProtectedRoute from "./components/protectedRoutes";
import ProtectedRouteAdmin from "./components/protectedRouteAdmin";
import AddProducts from "./pages/admin/addProducts";
import ProductDetail from "./pages/details";
import EmailVerify from "./pages/auth/emailVerify";
import NewProducts from "./pages/newProducts";
import NotFound from "./pages/notFound";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import DiscountCreation from "./pages/admin/discountCreation";
import Orders from "./pages/myOrders";
import OrderDetails from "./pages/orderDetails";
import SavedItems from "./pages/savedItems";
import AdminOrders from "./pages/admin/orders";
import ViewProducts from "./pages/admin/viewProducts";
import EditProducts from "./pages/admin/editProducts";
import ViewDiscounts from "./pages/admin/viewDiscounts";
import ForgotPassword from "./pages/auth/forgotPassword";


function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot" element={<ForgotPassword/>} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/email-verify"
            element={
              <ProtectedRoute>
                <EmailVerify />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-products"
            element={
              <ProtectedRouteAdmin>
                <AddProducts />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRouteAdmin>
                <AdminDashboard />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/discount-creation"
            element={
              <ProtectedRouteAdmin>
                <DiscountCreation />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/view-discounts"
            element={
              <ProtectedRouteAdmin>
                <ViewDiscounts />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/admin-orders"
            element={
              <ProtectedRouteAdmin>
                <AdminOrders />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/view-products"
            element={
              <ProtectedRouteAdmin>
                <ViewProducts />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            path="/edit-products/:id"
            element={
              <ProtectedRouteAdmin>
                <EditProducts />
              </ProtectedRouteAdmin>
            }
          />
          <Route
            element={
              <>
                <Navbar />
                <Outlet />
              </>
            }
          >
            <Route path="/" element={<Home />} />
            <Route exact path="/shop" element={<Shop />} />
            <Route exact path="/whats-new" element={<NewProducts />} />
            <Route exact path="/details/:id" element={<ProductDetail />} />
            <Route
              exact
              path="/saved-items"
              element={
                <ProtectedRoute>
                  <SavedItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/details/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
