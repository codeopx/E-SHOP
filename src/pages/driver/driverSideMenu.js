import { Avatar, Rate, Space } from "antd";
import "../../styles/pages/driver/driverSideMenu.css";
import { UserAuth } from "../../context/authContext";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import PuffLoader from "react-spinners/PuffLoader";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { FiActivity } from "react-icons/fi";
import { MdOutlineAccountCircle, MdOutlineSettings } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { AiOutlineLogout } from "react-icons/ai";

const DriverSideMenu = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  var text = user && user.email;
  var letter = text.charAt(0);

  const _support = () => {
    messageApi.open({
      type: "info",
      content: "09065478634",
    });
  };
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/driver-login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const userDetail = async () => {
    try {
      const docRef = doc(db, "users", user?.uid);
      const productDetail = await getDoc(docRef);
      setDetails(productDetail.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userDetail();
    return () => {
      userDetail();
    };
  }, [details]);
  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color={"#2f234f"} loading={loading} size={60} />
      </div>
    );
  }
  return (
    <div className="driver-side-menu">
      {contextHolder}
      <div className="driver-side-mini">
        <Avatar
          size={150}
          style={{
            backgroundColor: "#2f234f",
            color: "white",
            fontSize: 50,
            fontFamily: "Raleway",
          }}
        >
          {letter}
        </Avatar>
        <div className="d-details">
          <h1>{details?.name}</h1>
          <h2>{details?.email}</h2>
          <Space>
            <Rate
              disabled
              allowHalf
              value={
                details?.rating.length > 0
                  ? details?.rating.reduce((a, b) => a + b, 0) /
                    details?.rating.length
                  : 0
              }
              style={{ fontSize: 17 }}
            />
            <h3 className="driver-reviews-text">
              {details?.rating.length === 1
                ? details?.rating.length + " review"
                : details?.rating.length + " reviews"}
            </h3>
          </Space>
        </div>
      </div>
      <div onClick={() => navigate("/driver-activites")} className="list-tile">
        <div className="lt-1">
          <span>
            <FiActivity />
          </span>
        </div>
        <div className="lt-2">
          <h2>Activities</h2>
        </div>
      </div>
      <div onClick={() => navigate("/driver-account")} className="list-tile">
        <div className="lt-1">
          <span>
            <MdOutlineAccountCircle />
          </span>
        </div>
        <div className="lt-2">
          <h2>Account Details</h2>
        </div>
      </div>
      <div onClick={() => _support()} className="list-tile">
        <div className="lt-1">
          <span>
            <BiSupport />
          </span>
        </div>
        <div className="lt-2">
          <h2>Support</h2>
        </div>
      </div>
      <div className="list-tile">
        <div className="lt-1">
          <span>
            <MdOutlineSettings />
          </span>
        </div>
        <div className="lt-2">
          <h2>Settings</h2>
        </div>
      </div>
      <div onClick={() => handleLogout()} className="list-tile">
        <div className="lt-1">
          <span>
            <AiOutlineLogout />
          </span>
        </div>
        <div className="lt-2">
          <h2>Logout</h2>
        </div>
      </div>
    </div>
  );
};

export default DriverSideMenu;
