import "../styles/components/orderComponents.css";
import { useNavigate } from "react-router-dom";
import { ConfigProvider, Select, Space, message } from "antd";
import { useState } from "react";
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
import { db } from "../firebase";
import { UserAuth } from "../context/authContext";

const OrderComponents = ({ products }) => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [rate, setRate] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const OnRate = async (id) => {
    const docRef = doc(db, "order", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.rated.includes(user?.uid)) {
        messageApi.open({
          type: "error",
          content: "Rider already rated",
        });
      } else {
        await updateDoc(doc(db, "order", id), {
          rated: arrayUnion(user?.uid),
          rating: arrayUnion(rate),
        });
        await updateDoc(doc(db, "users", data.rider_uid), {
          rating: arrayUnion(rate),
        });
        messageApi.open({
          type: "success",
          content: "Rider Rated",
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
        <div className="order-components-card">
          <div className="oc-r1">
            <h2>{"Order Date : " + item.orderDate.toDate().toDateString()}</h2>
            <div className="r1">
              <h3>{"Total : " + "₦" + item.amount}</h3>
              <h4>{"Order No : " + item.orderID}</h4>
              <h5>{"Payment Info : " + "Payment Online"}</h5>
            </div>
            <div className="r2">
              <h5>{"Status : " + item.status}</h5>
              {item.status === "completed" ? (
                <Space>
                  <button onClick={() => OnRate(item.orderID)}>
                    Rate Rider
                  </button>
                  <ConfigProvider
                    theme={{
                      token: {
                        fontFamily: "Raleway",
                        controlHeight: 37,
                        colorPrimary: "#2f234f",
                      },
                    }}
                  >
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
                  </ConfigProvider>
                </Space>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="oc-r2">
            <button onClick={() => navigate(`/orders/details/${item.orderID}`)}>
              View Details
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderComponents;
