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
import DriverSignup from "./pages/driver/driverSignup";
import DriverLogin from "./pages/driver/driverLogin";
import EmailVerifyDriver from "./pages/driver/emailVerify";
import DriverDashboard from "./pages/driver/driverDashboard";
import PickDriver from "./pages/pickDriver";
import ViewRiders from "./pages/admin/viewRiders";
import DriverSideMenu from "./pages/driver/driverSideMenu";
import DriverActivites from "./pages/driver/driverActivities";
import DriverAccount from "./pages/driver/driverAccount";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/driver-login" element={<DriverLogin />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/driver-sign-up" element={<DriverSignup />} />
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
            path="/driver-email-verify"
            element={
              <ProtectedRoute>
                <EmailVerifyDriver />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedRoute>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-menu"
            element={
              <ProtectedRoute>
                <DriverSideMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-activites"
            element={
              <ProtectedRoute>
                <DriverActivites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-account"
            element={
              <ProtectedRoute>
                <DriverAccount />
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
            path="/view-riders"
            element={
              <ProtectedRouteAdmin>
                <ViewRiders />
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
            <Route
              path="/pick-driver/:id"
              element={
                <ProtectedRoute>
                  <PickDriver />
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
