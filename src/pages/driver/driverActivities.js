import { Tabs, ConfigProvider } from "antd";
import { useState, useEffect } from "react";
import { UserAuth } from "../../context/authContext";
import "../../styles/pages/driver/driverActivities.css";
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { excerpt } from "../../utility";

const DriverActivites = () => {
  const { user } = UserAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [transit, setTransit] = useState([]);
  const [completed, setCompleted] = useState([]);

  const getTransit = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(
      productRef,
      where("rider_uid", "==", user?.uid),
      where("status", "==", "transit")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setTransit(items);
  };
  const getCompleted = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(
      productRef,
      where("rider_uid", "==", user?.uid),
      where("status", "==", "completed")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setCompleted(items);
  };
  const checkDeliveries = async () => {
    const q = query(
      collection(db, "order"),
      where("rider_uid", "==", user?.uid)
    );
    let data = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
        setDeliveries(data);
      });
    });
  };
  useEffect(() => {
    checkDeliveries();
    return () => {
      checkDeliveries();
    };
  }, [deliveries]);
  useEffect(() => {
    getTransit();
    getCompleted();
    return () => {
      getTransit();
      getCompleted();
    };
  }, []);
  return (
    <div className="driver-activities">
      <h2>Delivery List</h2>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Raleway",
            colorPrimary: "#2f234f",
          },
        }}
      >
        <Tabs style={{ fontSize: "20px", fontWeight: "600" }}>
          <Tabs.TabPane tab="All Deliveries" key="tab1">
            <div>
              <DeliveryComponent products={deliveries} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="In Transist" key="tab2">
            <div>
            <DeliveryComponent products={transit} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Completed" key="tab3">
            <div>
            <DeliveryComponent products={completed} />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </ConfigProvider>
    </div>
  );
};

export default DriverActivites;

const DeliveryComponent = ({ products }) => {
  return (
    <>
      {products.map((item) => (
        <div className="delivery-component">
          <div className="dc-rw1">
            <h1>{excerpt(item.delivery_address, 60)}</h1>
            <h1>{item.phone}</h1>
            <h1>{item.town}</h1>
          </div>
          <div className="dc-rw2">
            {item.status === "completed" ? (
              <h1 className="dc-completed">{item.status}</h1>
            ) : (
              <h1 className="dc-Notcompleted">{item.status}</h1>
            )}
          </div>
        </div>
      ))}
    </>
  );
};
