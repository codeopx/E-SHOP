import { useParams } from "react-router-dom";
import "../styles/pages/orderDetails.css";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Button, Form, Select, Space, message } from "antd";
import { UserAuth } from "../context/authContext";

const OrderDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    id && orderDetails();
  }, [id]);

  const orderDetails = async () => {
    try {
      const docRef = doc(db, "order", id);
      const orderDetail = await getDoc(docRef);
      setProduct(orderDetail.data());
    } catch (error) {
      console.log(error);
    }
  };
  const getItems = async () => {
    const productRef = collection(db, "orderItems");
    const featuredQuery = query(productRef, where("orderID", "==", id));
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setItems(items);
  };
  useEffect(() => {
    getItems();
    return () => {
      getItems();
    };
  }, []);

  let address = product?.delivery_address || "";
  var shortenedAddress = address.substring(0, 25).concat("...");

  return (
    <div className="order-details-page">
      <h1>{"Order Details" + "(" + product?.status + ")"}</h1>
      <div className="order-details-card">
        <div className="order-details-info">
          <div className="odR1">
            <h2>Order Information</h2>
            <h2></h2>
          </div>
          <div className="odR2">
            <h2>Order Number</h2>
            <h3>{product?.orderID}</h3>
          </div>
          <div className="odR3">
            <h2>Order Date</h2>
            <h3>{product?.orderDate.toDate().toDateString()}</h3>
          </div>
          <div className="odR4">
            <h2>Payment Type</h2>
            <h3>{"Online Payment"}</h3>
          </div>
        </div>
        <div className="order-details-info">
          <div className="odR1">
            <h2>Delivery Information</h2>
            <h2></h2>
          </div>
          <div className="odR2">
            <h2>Customer Name</h2>
            <h3>{product?.names}</h3>
          </div>
          <div className="odR3">
            <h2>Delivery Address</h2>
            <h3>{shortenedAddress}</h3>
          </div>
          <div className="odR4">
            <h2>Customer Contact</h2>
            <h3>{product?.phone}</h3>
          </div>
        </div>
        <div className="order-details-info">
          <div className="odR1">
            <h2>Items Ordered</h2>
            <h3>Quantity</h3>
            <h3>Rating</h3>
          </div>
          <div>
            <OrderItems products={items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

const OrderItems = ({ products }) => {
  const { user } = UserAuth();
  const [rate, setRate] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const OnRate = async (id) => {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.rated.includes(user?.uid)) {
        messageApi.open({
          type: "error",
          content: "Product already rated",
        });
      } else {
        await updateDoc(doc(db, "products", id), {
          rated: arrayUnion(user?.uid),
          rating: arrayUnion(rate),
        });
        messageApi.open({
          type: "success",
          content: "Product Rated",
        });
        setRate("");
      }
    } else {
      console.log("No such document!");
    }
  };
  return (
    <>
      {contextHolder}
      {products.map((item) => (
        <div className="odR2">
          <h2>{item.name}</h2>
          <h3>{item.quantity}</h3>
          <Form>
            <Space>
              <Select
                onChange={(value) => {
                  setRate(value);
                }}
              >
                <Select.Option value={1}>
                  <span style={{ fontWeight: "600" }}>1</span>
                </Select.Option>
                <Select.Option value={2}>
                  <span style={{ fontWeight: "600" }}>2</span>
                </Select.Option>
                <Select.Option value={3}>
                  <span style={{ fontWeight: "600" }}>3</span>
                </Select.Option>
                <Select.Option value={4}>
                  <span style={{ fontWeight: "600" }}>4</span>
                </Select.Option>
                <Select.Option value={5}>
                  <span style={{ fontWeight: "600" }}>5</span>
                </Select.Option>
              </Select>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => OnRate(item.id)}
              >
                Rate Product
              </Button>
            </Space>
          </Form>
        </div>
      ))}
    </>
  );
};
