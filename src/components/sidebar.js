import {
  Sidebar,
  Menu,
  MenuItem,
  menuClasses,
  SubMenu,
} from "react-pro-sidebar";
import "../styles/components/sidebar.css";
import { BiLogOut } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import {
  AiOutlineSetting,
  AiOutlineHome,
  AiOutlineShopping,
} from "react-icons/ai";
import { NavLink,useNavigate } from "react-router-dom";
import { TbPigMoney } from "react-icons/tb";
import { RiMenu3Line } from "react-icons/ri";
import {
  MdOutlineLibraryAdd,
  MdOutlineWorkHistory,
  MdOutlineDeliveryDining,
  MdOutlineDiscount
} from "react-icons/md";
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { UserAuth } from "../context/authContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const SideBar = () => {
  const navigate =  useNavigate()
  const { user } = UserAuth();
  const [broken, setBroken] = useState(false);
  const [toggled, setToggled] = useState(false);

  var text = user && user.email;
  var letter = text.charAt(0);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/admin-login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="main-sidebar">
      <nav className="navbar">
        <div className="navbar-elements1">
          <div className="avatar">
            <h1>{letter}</h1>
          </div>
          <div className="email-row">
            <h1>{text}</h1>
            <BsChevronDown />
          </div>
        </div>
        <div className="m-icon">
          {broken && (
            <RiMenu3Line size={25} onClick={() => setToggled(!toggled)} />
          )}
        </div>
      </nav>
      <Sidebar
        breakPoint="xl"
        onBreakPoint={setBroken}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        className="sidebar"
        backgroundColor="#2f234f"
      >
        <Menu
          className="Menu"
          menuItemStyles={{
            subMenuContent: ({ level }) => ({
              backgroundColor: level === 0 ? "#40306b" : "transparent",
            }),
            button: {
              [`&.${menuClasses.disabled}`]: {
                color: "#9fb6cf",
              },
              "&:hover": {
                backgroundColor: "#ffffff",
                color: "#2f234f",
                fontSize: 16,
                fontWeight: 700,
              },
            },
          }}
        >
          <div className="menu1">
            <h1>iGadMart</h1>
          </div>
          <MenuItem
            onClick={() => setToggled(false)}
            className="menuitem"
            icon={<AiOutlineHome />}
            component={<NavLink to="/admin-dashboard" />}
          >
            Dashboard
          </MenuItem>
          <SubMenu label="Products" icon={<AiOutlineShopping />}>
            <MenuItem
              onClick={() => setToggled(false)}
              className="menuitem"
              icon={<MdOutlineLibraryAdd />}
              component={<NavLink to="/add-products" />}
            >
              Add Products
            </MenuItem>
            <MenuItem
              onClick={() => setToggled(false)}
              className="menuitem"
              icon={<FiShoppingBag />}
              component={<NavLink to="/view-products" />}
            >
              My Products
            </MenuItem>
          </SubMenu>
          <MenuItem
            onClick={() => setToggled(false)}
            className="menuitem"
            icon={<MdOutlineWorkHistory />}
            component={<NavLink to="/admin-orders" />}
          >
            My Orders
          </MenuItem>
          <MenuItem
            onClick={() => setToggled(false)}
            className="menuitem"
            icon={<AiOutlineSetting />}
            component={<NavLink to="/dashboard" />}
          >
            Settings
          </MenuItem>
         <SubMenu label="Coupon & Discounts" icon={<TbPigMoney />}>
         <MenuItem
            onClick={() => setToggled(false)}
            className="menuitem"
            icon={<MdOutlineLibraryAdd/>}
            component={<NavLink to="/discount-creation" />}
          >
            Create Coupon
          </MenuItem>
          <MenuItem
            onClick={() => setToggled(false)}
            className="menuitem"
            icon={<MdOutlineDiscount />}
            component={<NavLink to="/view-discounts"/>}
          >
            My Coupons
          </MenuItem>
         </SubMenu>
          <MenuItem
            onClick={() => setToggled(false)}
            className="menuitem"
            icon={<MdOutlineDeliveryDining />}
            component={<NavLink to="/view-riders"/>}
          >
            Riders
          </MenuItem>
          <MenuItem
            onClick={() => handleLogout()}
            className="menuitem"
            icon={<BiLogOut />}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
export default SideBar;
