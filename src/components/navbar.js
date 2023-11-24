import { NavLink, useNavigate } from "react-router-dom";
import "../styles/components/navbar.css";
import { BsBag } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { PiShoppingBagOpenDuotone } from "react-icons/pi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { RiMenu2Line, RiCloseLine } from "react-icons/ri";
import { useState, useEffect } from "react";
import { collection, where, onSnapshot,query } from "firebase/firestore";
import { db } from "../firebase";
import { Badge } from "antd";
import { UserAuth } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { excerpt } from "../utility";

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [cart, setCart] = useState([]);
  const { user } = UserAuth();

  var email = user && user.email;
  const navigate = useNavigate();

  const handleClick = () => {
    setClicked(!clicked);
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const checkCart = async () => {
    const q = query(collection(db, "cart"), where("id", "==", user?.uid || "1234"));
    let featured = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        featured.push({ id: doc.id, ...doc.data() });
        const total = featured.length;
        setCart(total);
      });
    });
  };
  useEffect(() => {
    checkCart();
    return () => {
      checkCart();
    };
  }, [cart]);

  if (!user) {
    return (
      <nav className="navbar">
        <div className={clicked ? "container active" : "container"}>
          <div onClick={() => navigate("/")} className="logo">
            iGadMart
          </div>
          <div className="nav-elements">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/shop">Shop</NavLink>
              </li>
              <li>
                <NavLink to="/whats-new">What's New</NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-icons">
            <div className="nav-icons-person">
              <div className="nav-icon-person-child">
                <span>
                  <GoPerson />
                </span>
                <h1>Account</h1>
              </div>
              <div class="dropdown-content">
                <button onClick={() => navigate("/login")}>Sign In</button>
                <div className="dp-account">
                  <span>
                    <MdOutlineFavoriteBorder />
                  </span>
                  <h1>Saved Items</h1>
                </div>
                <div className="dp-account">
                  <span>
                    <PiShoppingBagOpenDuotone />
                  </span>
                  <h1>Orders</h1>
                </div>
              </div>
            </div>
            <div onClick={() => navigate("/cart")} className="nav-icons-cart">
              <span>
                <Badge size="small">
                  <BsBag />
                </Badge>
              </span>
              <h1>Cart</h1>
            </div>
          </div>
        </div>
        <div className="nav-icons2">
          <div className="nav-icons-person">
            <div className="nav-icon-person-child">
              <span>
                <GoPerson />
              </span>
              <h1>Account</h1>
            </div>
            <div class="dropdown-content">
              <button>Sign In</button>
              <div className="dp-account">
                <span>
                  <MdOutlineFavoriteBorder />
                </span>
                <h1>Saved Items</h1>
              </div>
              <div className="dp-account">
                <span>
                  <PiShoppingBagOpenDuotone />
                </span>
                <h1>Orders</h1>
              </div>
            </div>
          </div>
          <div onClick={() => navigate("/cart")} className="nav-icons-cart">
            <span>
              <BsBag />
            </span>
            <h1>Cart</h1>
          </div>
        </div>
        <div onClickCapture={handleClick} className="menu">
          {clicked ? <RiCloseLine /> : <RiMenu2Line />}
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <div className={clicked ? "container active" : "container"}>
          <div onClick={() => navigate("/")} className="logo">
            iGadMart
          </div>
          <div className="nav-elements">
            <ul>
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                <NavLink to="/shop">Shop</NavLink>
              </li>
              <li>
                <NavLink to="/whats-new">What's New</NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-icons">
            <div className="nav-icons-person">
              <div className="nav-icon-person-child">
                <span>
                  <GoPerson />
                </span>
                <h1>{email}</h1>
              </div>
              <div class="dropdown-content">
                <button onClick={handleLogout}>LogOut</button>
                <div className="dp-account">
                  <span onClick={() => navigate("/saved-items")}>
                    <MdOutlineFavoriteBorder />
                  </span>
                  <h1>Saved Items</h1>
                </div>
                <div className="dp-account">
                  <span onClick={() => navigate("/orders")}>
                    <PiShoppingBagOpenDuotone />
                  </span>
                  <h1>Orders</h1>
                </div>
              </div>
            </div>
            <div onClick={() => navigate("/cart")} className="nav-icons-cart">
              <span>
                <Badge count={cart || 0} size="small">
                  <BsBag />
                </Badge>
              </span>
              <h1>Cart</h1>
            </div>
          </div>
        </div>
        <div className="nav-icons2">
          <div className="nav-icons-person">
            <div className="nav-icon-person-child">
              <span>
                <GoPerson />
              </span>
              <h1>{excerpt(email, 5)}</h1>
            </div>
            <div class="dropdown-content">
              <button onClick={handleLogout}>LogOut</button>
              <div className="dp-account">
                <span onClick={() => navigate("/saved-items")}>
                  <MdOutlineFavoriteBorder />
                </span>
                <h1>Saved Items</h1>
              </div>
              <div className="dp-account">
                <span onClick={() => navigate("/orders")}>
                  <PiShoppingBagOpenDuotone />
                </span>
                <h1>Orders</h1>
              </div>
            </div>
          </div>
          <div onClick={() => navigate("/cart")} className="nav-icons-cart">
            <span>
              <Badge count={cart || 0} size="small">
                <BsBag />
              </Badge>
            </span>
            <h1>Cart</h1>
          </div>
        </div>
        <div onClickCapture={handleClick} className="menu">
          {clicked ? <RiCloseLine /> : <RiMenu2Line />}
        </div>
      </nav>
    );
  }
};

export default Navbar;
