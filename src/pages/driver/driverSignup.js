import "../../styles/pages/driver/driverSignup.css";
import courier from "../../styles/images/courier.jpg";
import { Button, Form, Input, Alert, ConfigProvider, Space } from "antd";
import { useState } from "react";
import { IoPersonOutline, IoLockClosedOutline } from "react-icons/io5";
import {
  MdOutlineEmail,
  MdOutlinePhone,
  MdOutlineDirectionsBike,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

const DriverSignup = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, msg: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    if (!name || !phone || !email || !password || !number ) {
      setMessage({ error: true, msg: "All fields are required" });
      setLoading(false);
    } else {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          phone,
          number,
          driver: true,
          online:false,
          rating: [],
          picked:false,
          checked:false
        });
        await sendEmailVerification(result.user);
        form.resetFields();
        setLoading(false);
        setMessage("");
        Navigate("/driver-email-verify");
      } catch (err) {
        setMessage({ error: true, msg: err.message });
        setLoading(false);
      }
    }
  };
  return (
    <>
      <div className="driver-signupScreen">
        <div className="driver-signupScreen1">
          <img src={courier} alt="" />
        </div>
        <div className="driver-signupScreen2">
          <h2>Courier Signup</h2>
          <h3>Hey enter your details to create account</h3>
          <ConfigProvider
            button={{
              token: {
                controlHeight: 200,
              },
            }}
            theme={{
              token: {
                fontFamily: "Raleway",
                controlHeight: 35,
                colorPrimary: "#2f234f",
              },
            }}
          >
            <Form
              style={{ padding: "50px" }}
              layout="vertical"
              size={"large"}
              labelCol={{ span: 100 }}
              wrapperCol={{ span: 100 }}
              form={form}
              onFinish={handleSubmit}
              onSubmit={(e) => e.preventDefault()}
            >
              {message?.msg && (
                <Alert
                  message=""
                  description={message?.msg}
                  type="error"
                  showIcon
                />
              )}
              <Form.Item
                name="name"
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
                <Input
                  style={{ fontSize: "15px" }}
                  value={name}
                  placeholder="Enter your name"
                  prefix={<IoPersonOutline />}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="email" style={{ marginBottom: "10px" }}>
                <Input
                  style={{ fontSize: "15px" }}
                  value={email}
                  placeholder="Enter your email"
                  prefix={<MdOutlineEmail />}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="phone" style={{ marginBottom: "10px" }}>
                <Input
                  style={{ fontSize: "15px" }}
                  value={phone}
                  placeholder="Enter your phone"
                  prefix={<MdOutlinePhone />}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="number" style={{ marginBottom: "10px" }}>
                <Input
                  style={{ fontSize: "15px" }}
                  value={number}
                  placeholder="Enter your plate number"
                  prefix={<MdOutlineDirectionsBike />}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </Form.Item>
              <Form.Item name="password" style={{ marginBottom: "30px" }}>
                <Input.Password
                  style={{ fontSize: "15px" }}
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  value={password}
                  placeholder="Create password"
                  prefix={<IoLockClosedOutline />}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              {loading ? (
                <Button
                  size={"large"}
                  type="primary"
                  loading
                  block
                  style={{ backgroundColor: "#2f234f" }}
                  htmlType="submit"
                >
                  Sign Up
                </Button>
              ) : (
                <Button
                  size={"large"}
                  type="primary"
                  block
                  style={{ backgroundColor: "#2f234f" }}
                  htmlType="submit"
                >
                  Sign Up
                </Button>
              )}
              <div className="login-account">
                <p>
                  Already have an account?
                  <span onClick={() => Navigate("/driver-login")}>
                    Login here
                  </span>
                </p>
              </div>
            </Form>
          </ConfigProvider>
        </div>
      </div>
    </>
  );
};

export default DriverSignup;
