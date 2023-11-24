import { Button, Form, Input, Alert, ConfigProvider } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IoLockClosedOutline } from "react-icons/io5";
import "../../styles/pages/driver/driverSignup.css";
import courier from "../../styles/images/courier.jpg";
import { MdOutlineEmail } from "react-icons/md";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const DriverLogin = () => {
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, msg: "" });

  const handleSubmit = async () => {
    let data = [];
    setLoading(true);
    setMessage("");
    if (!email || !password) {
      setMessage({ error: true, msg: "All fields are required" });
      setLoading(false);
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        const docRef = doc(db, "users", result.user.uid);
        const productDetail = await getDoc(docRef);
        data = productDetail.data();
        if (data?.driver === true) {
          form.resetFields();
          setLoading(false);
          setMessage("");
          Navigate("/driver-dashboard");
        } else {
          setMessage({ error: true, msg: "Please use the user login page" });
        }
      } catch (err) {
        setMessage({ error: true, msg: err.message });
        setLoading(false);
      }
    }
  };

  return (
    <div className="driver-signupScreen">
      <div className="driver-signupScreen1">
        <img src={courier} alt="" />
      </div>
      <div className="driver-signupScreen2">
        <h2>Welcome Back</h2>
        <h3>Enter your details to login</h3>
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
              name="email"
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <Input
                style={{ fontSize: "15px" }}
                value={email}
                placeholder="Enter your email"
                prefix={<MdOutlineEmail />}
                onChange={(e) => setEmail(e.target.value)}
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
                Login
              </Button>
            ) : (
              <Button
                size={"large"}
                type="primary"
                block
                style={{ backgroundColor: "#2f234f" }}
                htmlType="submit"
              >
                Login
              </Button>
            )}
            <div className="login-account">
              <p>
                Don't have an account yet?
                <span onClick={() => Navigate("/driver-sign-up")}>
                  Create account
                </span>
              </p>
            </div>
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default DriverLogin;
