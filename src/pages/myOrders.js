import React from "react";
import { Tabs, ConfigProvider } from "antd";
import "../styles/pages/myOrders.css";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/authContext";
import OrderComponents from "../components/orderComponents";

const Orders = () => {
  const { user } = UserAuth();
  const [products, setProducts] = useState([]);
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [transit, setTransit] = useState([]);
  const [completed, setCompleted] = useState([]);

  const getPending = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(
      productRef,
      where("userID", "==", user?.uid),
      where("status", "==", "pending")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setPending(items);
  };
  const getProcessing = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(
      productRef,
      where("userID", "==", user?.uid),
      where("status", "==", "processing")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setProcessing(items);
  };
  const getTransit = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(
      productRef,
      where("userID", "==", user?.uid),
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
      where("userID", "==", user?.uid),
      where("status", "==", "completed")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setCompleted(items);
  };

  const checkOrder = async () => {
    const q = query(collection(db, "order"), where("userID", "==", user?.uid));
    let data = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
        setProducts(data);
      });
    });
  };
  useEffect(() => {
    checkOrder();
    return () => {
      checkOrder();
    };
  }, [products]);

  useEffect(() => {
    getPending();
    getProcessing();
    getTransit();
    getCompleted();
    return () => {
      getPending();
      getProcessing();
      getTransit();
      getCompleted();
    };
  }, []);

  return (
    <div className="order-page">
      <h2>Order List</h2>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Raleway",
            colorPrimary: "#2f234f",
          },
        }}
      >
        <Tabs style={{ fontSize: "20px", fontWeight: "600" }}>
          <Tabs.TabPane tab="All Orders" key="tab1">
            <div>
              <OrderComponents products={products} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Order Pending" key="tab2">
            <div>
              <OrderComponents products={pending} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Order Processing" key="tab3">
            <div>
              <OrderComponents products={processing} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="In Transist" key="tab4">
            <div>
              <OrderComponents products={transit} />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Completed" key="tab5">
            <div>
              <OrderComponents products={completed} />
            </div>
          </Tabs.TabPane>
        </Tabs>
      </ConfigProvider>
    </div>
  );
};

export default Orders;
