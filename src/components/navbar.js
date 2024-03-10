import { NavLink, useNavigate } from "react-router-dom";
import "../styles/components/navbar.css";
import { BsBag } from "react-icons/bs";
import { GoPerson } from "react-icons/go";
import { PiShoppingBagOpenDuotone } from "react-icons/pi";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { RiMenu2Line, RiCloseLine } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { collection, where, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { Badge } from "antd";
import { UserAuth } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { excerpt } from "../utility";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpen(false);
        console.log(menuRef.current);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });
  const [clicked, setClicked] = useState(false);
  const [cart, setCart] = useState([]);
  const { user } = UserAuth();

  var email = user && user.email;
  const navigate = useNavigate();

  const handleClick = () => {
    setClicked(!clicked);
  };
  const savedItems = () => {
    setOpen(!open);
    navigate("/saved-items")
  };
  const orders = () => {
    setOpen(!open);
    navigate("/orders");
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
    const q = query(
      collection(db, "cart"),
      where("id", "==", user?.uid || "1234")
    );
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
            <div className="menu-container" ref={menuRef}>
              <div
                className="menu-trigger"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <GoPerson className="dp-icon" />
                <h1>Account</h1>
              </div>

              <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
                <ul>
                  <button onClick={() => navigate("/login")}>Sign In</button>
                  <DropdownItem
                    img={<MdOutlineFavoriteBorder />}
                    text={"Saved Items"}
                  />
                  <DropdownItem
                    img={<PiShoppingBagOpenDuotone />}
                    text={"Orders"}
                  />
                </ul>
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
          <div className="menu-container" ref={menuRef}>
            <div
              className="menu-trigger"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <GoPerson className="dp-icon" />
              <h1>Account</h1>
            </div>

            <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
              <ul>
                <button onClick={() => navigate("/login")}>Sign In</button>
                <DropdownItem
                  img={<MdOutlineFavoriteBorder />}
                  text={"Saved Items"}
                />
                <DropdownItem
                  img={<PiShoppingBagOpenDuotone />}
                  text={"Orders"}
                />
              </ul>
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
            <div className="menu-container" ref={menuRef}>
              <div
                className="menu-trigger"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <GoPerson className="dp-icon" />
                <h1>{email}</h1>
              </div>

              <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
                <ul>
                  <button onClick={handleLogout}>LogOut</button>
                  <div onClick={() => savedItems()}>
                    <DropdownItem
                      img={<MdOutlineFavoriteBorder />}
                      text={"Saved Items"}
                    />
                  </div>
                  <div onClick={() => orders()}>
                    <DropdownItem
                      img={<PiShoppingBagOpenDuotone />}
                      text={"Orders"}
                    />
                  </div>
                </ul>
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
        <div className="menu-container" ref={menuRef}>
              <div
                className="menu-trigger"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <GoPerson className="dp-icon" />
                <h1>{excerpt(email, 5)}</h1>
              </div>

              <div className={`dropdown-menu ${open ? "active" : "inactive"}`}>
                <ul>
                  <button onClick={handleLogout}>LogOut</button>
                  <div onClick={() => savedItems()}>
                    <DropdownItem
                      img={<MdOutlineFavoriteBorder />}
                      text={"Saved Items"}
                    />
                  </div>
                  <div onClick={() => orders()}>
                    <DropdownItem
                      img={<PiShoppingBagOpenDuotone />}
                      text={"Orders"}
                    />
                  </div>
                </ul>
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

function DropdownItem(props) {
  return (
    <li className="dropdownItem">
      <span>{props.img}</span>
      {/* <img src={props.img}></img> */}
      <a> {props.text} </a>
    </li>
  );
}

export default Navbar;
