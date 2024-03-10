import "../styles/pages/checkout.css";
import { motion } from "framer-motion";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Form, Input, ConfigProvider, Select, Button, message } from "antd";
import PuffLoader from "react-spinners/PuffLoader";
import { usePaystackPayment } from "react-paystack";
import {
  collection,
  where,
  onSnapshot,
  getAggregateFromServer,
  query,
  sum,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  Timestamp,
  FieldValue,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/authContext";
import CheckoutProducts from "../components/checkoutProducts";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const Checkout = () => {
  const { user } = UserAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const [cartproducts, setCartProducts] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [total, setTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [d, setD] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [loading, setLoading] = useState(false);

  ///form data
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [town, setTown] = useState("");
  const [ship, setShip] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const discountCheck = async () => {
    const productRef = collection(db, "discounts");
    const featuredQuery = query(productRef, where("code", "==", d));
    const querySnapshots = await getDocs(featuredQuery);
    if (!querySnapshots.empty) {
      querySnapshots.forEach((doc) => {
        const data = doc.data();
        const discount_percentage = data.percentage;
        setDiscount((discount_percentage / 100) * total);
      });
      messageApi.open({
        type: "success",
        content: "Coupon Code Applied",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Invalid Coupon Code",
      });
    }
  };
  const ShippingFee = (value) => {
    if (value === "Lagos State" || value === "Ogun State") {
      setShipping(2000);
      setGrandTotal(total + 2000);
    } else if (
      value === "Ondo State" ||
      value === "Osun State" ||
      value === "Oyo State" ||
      value === "Ekiti State"
    ) {
      setShipping(3000);
      setGrandTotal(total + 3000);
    } else if (
      value === "Rivers State" ||
      value === "Edo State" ||
      value === "Delta State" ||
      value === "Cross River State" ||
      value === "Bayelsa State" ||
      value === "Akwa Ibom State"
    ) {
      setShipping(4000);
      setGrandTotal(total + 4000);
    } else if (
      value === "Imo State" ||
      value === "Enugu State" ||
      value === "Ebonyi State" ||
      value === "Anambra State" ||
      value === "Abia State"
    ) {
      setShipping(3500);
      setGrandTotal(total + 3500);
    } else if (
      value === "Plateau State" ||
      value === "Niger State" ||
      value === "Nasarawa State" ||
      value === "Kwara State" ||
      value === "Kogi State" ||
      value === "Benue State" ||
      value === "Abuja(FCT)"
    ) {
      setShipping(5000);
      setGrandTotal(total + 5000);
    } else {
      setShipping(6000);
      setGrandTotal(total + 6000);
    }
  };
  const config = {
    reference: new Date().getTime().toString(),
    email: user && user.email,
    amount: (grandTotal - discount) * 100,
    publicKey: "pk_test_542d83252dabe29806ca205d823c6334a0f02086",
  };
  const onSuccess = (reference) => {
    console.log(reference);
    createOrder();
  };

  const onClose = () => {
    console.log("closed");
    console.log(grandTotal);
  };

  const initializePayment = usePaystackPayment(config);

  const checkout = () => {
    if (
      name === "" ||
      country === "" ||
      address === "" ||
      town === "" ||
      ship === "" ||
      phone === ""
    ) {
      messageApi.open({
        type: "error",
        content: "Please complete all fields",
      });
    } else {
      initializePayment(onSuccess, onClose);
    }
  };

  const createOrder = async () => {
    const docRef = await addDoc(collection(db, "order"), {
      names: name,
      country: country,
      delivery_address: address.label,
      town: town,
      phone: phone,
      notes: notes,
      userID: user?.uid,
      status: "pending",
      amount: grandTotal - discount,
      orderDate: Timestamp.now(),
    });
    await updateDoc(doc(db, "order", docRef.id), {
      orderID: docRef.id,
    });
    const productRef = collection(db, "cart");
    const featuredQuery = query(productRef, where("id", "==", user?.uid));
    const querySnapshots = await getDocs(featuredQuery);
    querySnapshots.forEach(async (docs) => {
      const data = docs.data();
      const quantity = data.quantity;
      const name = data.name;
      const _id = data.productID;
      const cartID = data.cartID;

      const docRef2 = await addDoc(collection(db, "orderItems"), {
        name: name,
        quantity: quantity,
        id: _id,
        orderID: docRef.id,
      });
      await updateDoc(doc(db, "products", _id), {
        quantity: increment(-quantity),
      });
      await deleteDoc(doc(db, "cart", cartID)).then(() => {
        setLoading(true);
        navigate("/");
        window.location.reload(false);
      });
    });
  };
  const cartProducts = () => {
    const q = query(collection(db, "cart"), where("id", "==", user?.uid));
    let featured = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        featured.push({ id: doc.id, ...doc.data() });
        setCartProducts(featured);
      });
    });
  };
  useEffect(() => {
    cartProducts();
    return () => {
      cartProducts();
    };
  }, [cartproducts]);

  useEffect(() => {
    const getSum = async () => {
      const coll = collection(db, "cart");
      const q = query(coll, where("id", "==", user?.uid));
      const snapshot = await getAggregateFromServer(q, {
        total: sum("price"),
      });
      setTotal(snapshot.data().total);
      // console.log(total)
    };
    return () => {
      getSum();
    };
  }, [total]);
  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color={"#2f234f"} loading={loading} size={60} />
      </div>
    );
  }
  return (
    <div className="checkout-details">
      {contextHolder}
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3 }}
        whileInView={{ scale: 1, opacity: 1 }}
      >
        Checkout
      </motion.h1>

      <div className="checkout-details-row">
        <ConfigProvider
          button={{
            token: {
              controlHeight: 200,
            },
          }}
          theme={{
            token: {
              fontFamily: "Raleway",
              controlHeight: 60,
              colorPrimary: "#2f234f",
            },
          }}
        >
          <div className="checkout-details-card1">
            <Form
              // form={form}
              className="detailsform"
              onSubmit={(e) => e.preventDefault()}
              layout="vertical"
              size={"small"}
              labelCol={{ span: 100 }}
              wrapperCol={{ span: 100 }}
              // onFinish={upload}
            >
              <h2>Shipping</h2>
              <Form.Item
                label="Full Name"
                name="Full Name"
                style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid full name",
                  },
                ]}
              >
                <Input
                  style={{ fontWeight: "500" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Country"
                name="Country"
                style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid country",
                  },
                ]}
              >
                <Input
                  style={{ fontWeight: "500" }}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Street address"
                name="Street address"
                style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid street address",
                  },
                ]}
              >
                <GooglePlacesAutocomplete
                  selectProps={{
                    address,
                    onChange: setAddress,
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Town / City"
                name="Town City"
                style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid town and city",
                  },
                ]}
              >
                <Input
                  style={{ fontWeight: "500" }}
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="State"
                name="State"
                style={{ marginBottom: "0px" }}
                labelCol
                rules={[
                  {
                    required: true,
                    message: "Please select a state",
                  },
                ]}
              >
                <Select
                  onChange={(value) => {
                    ShippingFee(value);
                    setShip(value);
                  }}
                  style={{ fontSize: "90px" }}
                >
                  <Select.Option value="Abia State">
                    <span style={{ fontWeight: "600" }}>Abia State</span>
                  </Select.Option>
                  <Select.Option value="Abuja(FCT)">
                    <span style={{ fontWeight: "600" }}>Abuja(FCT)</span>
                  </Select.Option>
                  <Select.Option value="Adamawa State">
                    <span style={{ fontWeight: "600" }}>Adamawa State </span>
                  </Select.Option>
                  <Select.Option value="Akwa Ibom State">
                    <span style={{ fontWeight: "600" }}>Akwa Ibom State</span>
                  </Select.Option>
                  <Select.Option value="Anambra State">
                    <span style={{ fontWeight: "600" }}>Anambra State</span>
                  </Select.Option>
                  <Select.Option value="Bauchi State">
                    <span style={{ fontWeight: "600" }}>Bauchi State</span>
                  </Select.Option>
                  <Select.Option value="Bayelsa State">
                    <span style={{ fontWeight: "600" }}>Bayelsa State</span>
                  </Select.Option>
                  <Select.Option value="Benue State">
                    <span style={{ fontWeight: "600" }}>Benue State</span>
                  </Select.Option>
                  <Select.Option value="Borno State">
                    <span style={{ fontWeight: "600" }}>Borno State</span>
                  </Select.Option>
                  <Select.Option value="Cross River State">
                    <span style={{ fontWeight: "600" }}>Cross River State</span>
                  </Select.Option>
                  <Select.Option value="Delta State">
                    <span style={{ fontWeight: "600" }}>Delta State</span>
                  </Select.Option>
                  <Select.Option value="Ebonyi State">
                    <span style={{ fontWeight: "600" }}>Ebonyi State</span>
                  </Select.Option>
                  <Select.Option value="Edo State">
                    <span style={{ fontWeight: "600" }}>Edo State</span>
                  </Select.Option>
                  <Select.Option value="Ekiti State">
                    <span style={{ fontWeight: "600" }}>Ekiti State</span>
                  </Select.Option>
                  <Select.Option value="Enugu State">
                    <span style={{ fontWeight: "600" }}>Enugu State</span>
                  </Select.Option>
                  <Select.Option value="Gombe State">
                    <span style={{ fontWeight: "600" }}>Gombe State</span>
                  </Select.Option>
                  <Select.Option value="Imo State">
                    <span style={{ fontWeight: "600" }}>Imo State</span>
                  </Select.Option>
                  <Select.Option value="Jigawa State">
                    <span style={{ fontWeight: "600" }}>Jigawa State</span>
                  </Select.Option>
                  <Select.Option value="Kaduna State">
                    <span style={{ fontWeight: "600" }}>Kaduna State</span>
                  </Select.Option>
                  <Select.Option value="Kano State">
                    <span style={{ fontWeight: "600" }}>Kano State</span>
                  </Select.Option>
                  <Select.Option value="Katsina State">
                    <span style={{ fontWeight: "600" }}>Katsina State</span>
                  </Select.Option>
                  <Select.Option value="Kebbi State">
                    <span style={{ fontWeight: "600" }}>Kebbi State</span>
                  </Select.Option>
                  <Select.Option value="Kogi State">
                    <span style={{ fontWeight: "600" }}>Kogi State </span>
                  </Select.Option>
                  <Select.Option value="Kwara State">
                    <span style={{ fontWeight: "600" }}>Kwara State</span>
                  </Select.Option>
                  <Select.Option value="Lagos State">
                    <span style={{ fontWeight: "600" }}>Lagos State</span>
                  </Select.Option>
                  <Select.Option value="Nasarawa State">
                    <span style={{ fontWeight: "600" }}>Nasarawa State</span>
                  </Select.Option>
                  <Select.Option value="Niger State">
                    <span style={{ fontWeight: "600" }}>Niger State</span>
                  </Select.Option>
                  <Select.Option value="Ogun State">
                    <span style={{ fontWeight: "600" }}>Ogun State </span>
                  </Select.Option>
                  <Select.Option value="Ondo State">
                    <span style={{ fontWeight: "600" }}>Ondo State</span>
                  </Select.Option>
                  <Select.Option value="Osun State">
                    <span style={{ fontWeight: "600" }}>Osun State</span>
                  </Select.Option>
                  <Select.Option value="Oyo State">
                    <span style={{ fontWeight: "600" }}>Oyo State</span>
                  </Select.Option>
                  <Select.Option value="Plateau State">
                    <span style={{ fontWeight: "600" }}>Plateau State</span>
                  </Select.Option>
                  <Select.Option value="Rivers State">
                    <span style={{ fontWeight: "600" }}>Rivers State</span>
                  </Select.Option>
                  <Select.Option value="Sokoto State">
                    <span style={{ fontWeight: "600" }}>Sokoto State </span>
                  </Select.Option>
                  <Select.Option value="Taraba State">
                    <span style={{ fontWeight: "600" }}>Taraba State </span>
                  </Select.Option>
                  <Select.Option value="Yobe State">
                    <span style={{ fontWeight: "600" }}>Yobe State</span>
                  </Select.Option>
                  <Select.Option value="Zamfara State">
                    <span style={{ fontWeight: "600" }}>Zamfara State</span>
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Phone"
                name="Phone"
                style={{ marginBottom: "0px" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid phone number",
                  },
                ]}
              >
                <Input
                  style={{ fontWeight: "500" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                label="Order notes(optional)"
                name="Order notes"
                style={{ marginBottom: "10px" }}
                labelCol
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <TextArea
                  allowClear
                  showCount
                  maxLength={300}
                  style={{ fontWeight: "500" }}
                  autoSize={{ minRows: 5, maxRows: 5 }}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Form.Item>
            </Form>
          </div>
        </ConfigProvider>
        <div className="checkout-details-card2">
          <h4>Order Summary</h4>
          <div className="checkout-details-cardC">
            <CheckoutProducts products={cartproducts} />
            <h4>Coupon code</h4>
            <Form onSubmit={(e) => e.preventDefault()} onFinish={discountCheck}>
              <div className="coupon-row">
                <ConfigProvider
                  theme={{
                    token: {
                      fontFamily: "Raleway",

                      colorPrimary: "#2f234f",
                    },
                  }}
                >
                  <Input
                    value={d}
                    onChange={(e) => setD(e.target.value)}
                    className="coupon-input"
                  />
                  <Button
                    htmlType="submit"
                    type="text"
                    style={{ color: "red" }}
                  >
                    Apply
                  </Button>
                </ConfigProvider>
              </div>
            </Form>
            <div className="checkout-subtotal">
              <h5>Subtotal</h5>
              <h6>{total.toLocaleString()}</h6>
            </div>
            <div className="checkout-discount">
              <h5>Discount</h5>
              <h6>{"-" + discount.toLocaleString()}</h6>
            </div>
            <div className="checkout-shipping">
              <h5>Shipping</h5>
              <h6>{shipping.toLocaleString()}</h6>
            </div>
            <hr class="solid2"></hr>
            <div className="checkout-grandTotal">
              <h5>Grand Total</h5>
              <h6>{grandTotal - discount}</h6>
            </div>
            <div className="checkout-button-row">
              <button onClick={checkout} className="checkout-button">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
