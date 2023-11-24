import { BarLoader } from "react-spinners";
import "../styles/pages/pickDriver.css";
import { useState, useEffect } from "react";
import riderImage from "../styles/images/pick.jpg";
import {
  collection,
  getDocs,
  limit,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import { Rate, Space } from "antd";
/*global google*/

const PickDriver = () => {
  const navigate = useNavigate();
  const generateRandomString = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
  };
  const { id } = useParams();
  const [picked, setPicked] = useState(true);
  const [riders, setRiders] = useState(null);
  const [request, setRequest] = useState(null);
  const [order, setOrder] = useState(null);
  const [random, setRandom] = useState(generateRandomString());
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [initial, setInitial] = useState("No driver selected!");

  const getOrder = async () => {
    try {
      const docRef = doc(db, "order", id);
      const orderDetail = await getDoc(docRef);
      setOrder(orderDetail.data());
    } catch (error) {
      console.log(error);
    }
  };
  const onPicked = async () => {
    setLoading(true)
    var lat;
    var lng;
    var riders = [];
    var latRiders;
    var lngRiders;
    var distance;
    var duration;
    var id;
    setText("Searching for nearby riders.....");
    setPicked(!picked);
    navigator.geolocation.getCurrentPosition(function (position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
    });
    const productRef = collection(db, "users");
    const featuredQuery = query(
      productRef,
      where("picked", "==", false),
      where("checked", "==", false),
      where("online", "==", true),
      limit(1)
    );
    const querySnapshots = await getDocs(featuredQuery);
    let featured = [];
    querySnapshots.forEach((doc) => {
      featured.push({ id: doc.id, ...doc.data() });
    });
    riders = featured;
    if (riders.length === 0) {
      setText("No Riders found Nearby");
      setPicked(false);
      setInitial("No Riders found Nearby");
      setLoading(false);
    } else {
      latRiders = riders.map((item) => item.lat);
      lngRiders = riders.map((item) => item.lng);
      id = riders.map((item) => item.uid);

      var origin = {
        lat: Number(latRiders.toString()),
        lng: Number(lngRiders.toString()),
      };
      var destination = { lat: lat, lng: lng };
      const directionService = new google.maps.DirectionsService();
      const results = await directionService.route({
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });
      distance = results.routes[0].legs[0].distance.text;
      duration = results.routes[0].legs[0].duration.text;
      console.log(distance.slice(-2));
      if (distance.slice(-2) === " m") {
        var _dist = distance.replace(/[^\d.-]/g, "");
        var dist = Number(_dist / 1000);
        await updateDoc(doc(db, "users", id.toString()), {
          checked: true,
        });
      } else {
        var _dist = distance.replace(/[^\d.-]/g, "");
        var dist = Number(_dist);
        await updateDoc(doc(db, "users", id.toString()), {
          checked: true,
        });
      }
      checkDistance(dist, id, duration, lat, lng);
    }
  };

  const checkDistance = async (dist, id, duration, lat, lng) => {
    if (dist <= 4.5) {
      const docRef = await addDoc(collection(db, "requests"), {
        distance: dist,
        duration: duration,
        uid: id.toString(),
        lat: lat,
        lng: lng,
        viewed: false,
        accepeted: false,
      });
      await updateDoc(doc(db, "requests", docRef.id), {
        requestID: docRef.id,
      });
      setText("Delivery Request Sent.....");
      setTimeout(() => {
        checkRequest(docRef.id);
      }, 20000);
    } else {
      const docRef2 = await addDoc(collection(db, "checked"), {
        id: id.toString(),
      });
      await updateDoc(doc(db, "checked", docRef2.id), {
        CheckedID: docRef2.id,
      });
      onPicked();
    }
  };
  const checkRequest = async (id) => {
    var accepeted;
    var uid;
    const docRef3 = doc(db, "requests", id);
    const productDetail = await getDoc(docRef3);
    accepeted = productDetail.data().accepeted;
    uid = productDetail.data().uid;
    console.log(accepeted);
    if (accepeted === true) {
      setText("Delivery accepted........");
      const docRef = doc(db, "users", uid);
      const userDetail = await getDoc(docRef);
      setRiders(userDetail.data());
      const docRef3 = doc(db, "requests", id);
      const requestDetail = await getDoc(docRef3);
      setRequest(requestDetail.data());
      setLoading(false);
    } else {
      await updateDoc(doc(db, "requests", id), {
        viewed: true,
      });
      const docRef2 = await addDoc(collection(db, "checked"), {
        id: uid,
      });
      await updateDoc(doc(db, "checked", docRef2.id), {
        CheckedID: docRef2.id,
      });
      setText("Delivery rejected...........");
      setText("Finding other nearby riders........");
      onPicked();
    }
  };
  useEffect(() => {
    id && getOrder();
  }, [id]);

  const confirm = async (name, phone, number, uid) => {
    const productRef = collection(db, "checked");
    const featuredQuery = query(productRef);
    const querySnapshots = await getDocs(featuredQuery);
    querySnapshots.forEach(async (docs) => {
      const data = docs.data();
      const _id = data.id;
      const ID = data.CheckedID;

      await updateDoc(doc(db, "users", _id), {
        checked: false,
      });
      await deleteDoc(doc(db, "checked", ID));
    });
    await updateDoc(doc(db, "order", id), {
      rider_name: name,
      rider_number: phone,
      rider_phone: number,
      rider_uid: uid,
      rating: [],
      rated:[]
    }).then(() => {
      navigate("/");
      window.location.reload(false);
    });
  };

  const cancel = async (_id) => {
    await updateDoc(doc(db, "users", _id), {
      picked: false,
    });
    setPicked(false);
  };

  if (picked === true) {
    return (
      <div className="pick-driver-container">
        <div className="pd-subC">
          {loading ? (
            <div className="pd-subC1-p">
              <h1 style={{ marginBottom: "10px" }}>{text}</h1>
              <BarLoader
                color={"#2f234f"}
                loading={loading}
                size={60}
                width="80%"
              />
            </div>
          ) : (
            <>
              <div className="pd-subC1">
                <div className="pd-imageC">
                  <img src={riderImage} alt="" />
                </div>
                <div className="pd-details">
                  <div className="row-1">
                    <div className="col-1">
                      <h1>Rider Name</h1>
                      <h2>{riders?.name}</h2>
                    </div>
                    <div className="col-2">
                      <h1>Rider Phone</h1>
                      <h2>{riders?.phone}</h2>
                    </div>
                    <div className="col-3">
                      <h1>Vehicle No</h1>
                      <h2>{riders?.number}</h2>
                    </div>
                  </div>
                  <div className="row-2">
                    <div className="col-1">
                      <h1>Distance</h1>
                      <h2>{request?.distance + " km"}</h2>
                    </div>
                    <div className="col-2">
                      <h1>Estimated Duration</h1>
                      <h2>{request?.duration}</h2>
                    </div>
                    <div className="col-3">
                      <h1>Delivery Code</h1>
                      <h2>{random}</h2>
                    </div>
                  </div>
                  <div className="pd-rate">
                    <Space>
                      <Rate
                        disabled
                        allowHalf
                        value={
                          riders?.rating.length > 0
                            ? riders?.rating.reduce((a, b) => a + b, 0) /
                              riders?.rating.length
                            : 0
                        }
                        style={{ fontSize: 15 }}
                      />
                      <h1 className="rate">
                        {riders?.rating.length === 1
                          ? riders?.rating.length + " review"
                          : riders?.rating.length + " reviews"}
                      </h1>
                    </Space>
                  </div>
                </div>
                <div className="pd-buttons">
                  <button
                    onClick={() =>
                      confirm(
                        riders?.name,
                        riders?.phone,
                        riders?.number,
                        riders?.uid
                      )
                    }
                    className="cn"
                  >
                    Confirm
                  </button>
                  <button onClick={() => cancel(riders?.uid)} className="ca">
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="pick-driver-container">
        <div className="pd-subC">
          <div className="pd-subC1-p">
            <h1>{initial}</h1>
          </div>
          <div className="pd-subC2">
            <button onClick={onPicked}>Pick Rider</button>
          </div>
        </div>
      </div>
    );
  }
};
export default PickDriver;
