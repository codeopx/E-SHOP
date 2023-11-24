import "../../styles/pages/driver/driverDashboard.css";
import { CiMenuFries } from "react-icons/ci";
import PuffLoader from "react-spinners/PuffLoader";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import {
  getDoc,
  addDoc,
  collection,
  updateDoc,
  doc,
  onSnapshot,
  getDocs,
  where,
  query,
  deleteDoc,
} from "firebase/firestore";
import { UserAuth } from "../../context/authContext";
import Modal from "antd/es/modal/Modal";

const DriverDashboard = () => {
  const navigate = useNavigate()
  const { user } = UserAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [online, setOnline] = useState(null);
  const [location, setLocation] = useState({});
  const [request, setRequest] = useState([]);
  // const [lat, setlat] = useState(null);
  const [id, setID] = useState(null);
  const [duration, setDuration] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
  });

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      console.log(location);
      setLoading(false);
    });
  };

  const _check = async () => {
    onSnapshot(doc(db, "users", user?.uid), (doc) => {
      setOnline(doc.data().online);
      setLoading(false);
    });
  };
  const goOnline = async () => {
    await updateDoc(doc(db, "users", user?.uid), {
      lat: location.lat,
      lng: location.lng,
      online: true,
    });
  };
  const goOffline = async () => {
    await updateDoc(doc(db, "users", user?.uid), {
      online: false,
    });
  };
  const handleOk = async () => {
    await updateDoc(doc(db, "requests", id), {
      accepeted: true,
      viewed: true,
    });
    await updateDoc(doc(db, "users", user?.uid), {
      picked: true,
    });
    setIsModalOpen(false);
  };
  const handleCancel = async () => {
    await updateDoc(doc(db, "requests", id), {
      viewed: true,
    });
    const docRef2 = await addDoc(collection(db, "checked"), {
      id: user?.uid,
    });
    await updateDoc(doc(db, "checked", docRef2.id), {
      CheckedID: docRef2.id,
    });
    setIsModalOpen(false);
  };
  const checkRequest = async () => {
    const q = query(
      collection(db, "requests"),
      where("uid", "==", user?.uid),
      where("viewed", "==", false)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setRequest(doc.data());
        setID(doc.data().requestID);
        setDistance(doc.data().distance);
        setDuration(doc.data().duration);
      });
    });
    if (request.length === 0) {
      console.log(0);
    } else {
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    getLocation();
    _check();
    checkRequest();
    return () => {
      getLocation();
      _check();
      checkRequest();
    };
  }, [online, request]);
  if (!isLoaded) {
    return <div>Loading maps</div>;
  }
  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color={"#2f234f"} loading={loading} size={60} />
      </div>
    );
  }
  return (
    <>
    <div className="driver-d-container">
      <h1>Please view this page on a smaller device</h1>
      <nav className="driver-nav">
        <div className="driver-nav-container">
          <div className="d-logo">iGadMart</div>
          <span onClick={()=>navigate('/driver-menu')}>
            <CiMenuFries />
          </span>
        </div>
      </nav>
      <div className="driver-dashboardC">
        <Modal
          title="Delivery Request"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Raleway",
            }}
          >
            <p>{`You have a delivery request ${distance}km away`}</p>
            <h1
              style={{ fontSize: "17px" }}
            >{`Estimated completion time: ${duration}`}</h1>
          </div>
        </Modal>
        <div className="map-container">
          <GoogleMap
            center={location}
            mapContainerClassName="map-container"
            zoom={15}
          >
            <Marker position={location} />
          </GoogleMap>
        </div>
        <div className="driver-buttomSheet">
          <div className="buttomSheet">
            {!online ? (
              <button onClick={() => goOnline()} className="but">
                Go Online
              </button>
            ) : (
              <button onClick={() => goOffline()} className="but-1">
                Go Offline
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DriverDashboard;
