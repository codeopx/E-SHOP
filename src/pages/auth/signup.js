import '../../styles/pages/auth/login.css'
import { Button, Form, Input, Alert, Checkbox, Space, ConfigProvider } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, msg: "" });
  const Navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [form] = Form.useForm();

  const handleAgreement = (event) => {
    setAgreement(event.target.checked);
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    setMessage("");
    if (!name || !phone || !email || !password || !confirm) {
      setMessage({ error: true, msg: "All fields are required" });
      setLoading(false);
    } else if (password != confirm) {
      setMessage({ error: true, msg: "Passwords are not the same" });
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
          driver:false
        });
        await sendEmailVerification(result.user);
        form.resetFields();
        setLoading(false);
        setMessage("");
        Navigate("/email-verify");
      } catch (err) {
        setMessage({ error: true, msg: err.message });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <section className="login-intro">
        <div className="login-container">
          <div className="form-content">
            <header>Register yourself here</header>
            <Form
              layout="vertical"
              size={"large"}
              labelCol={{ span: 100 }}
              wrapperCol={{ span: 100 }}
              onFinish={handleSubmit}
              onSubmit={(e) => e.preventDefault()}
              form={form}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                {message?.msg && (
                  <Alert
                    message=""
                    description={message?.msg}
                    type="error"
                    showIcon
                  />
                )}
                <span className="sp1">Names</span>
              </Space>
              <Form.Item name="brand" style={{ marginBottom: "10px" }}>
                <Input
                  value={name}
                  placeholder=""
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>
              <span className="sp2">Phone Number</span>
              <Form.Item name="phone" style={{ marginBottom: "10px" }}>
                <Input
                  value={phone}
                  placeholder=""
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Item>
              <span className="sp3">Email Address</span>
              <Form.Item name="email" style={{ marginBottom: "10px" }}>
                <Input
                  value={email}
                  placeholder=""
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <span className="sp4">Password</span>
              <Form.Item name="password" style={{ marginBottom: "10px" }}>
                <Input.Password
                  value={password}
                  placeholder=""
                  visibilityToggle={{
                    visible: passwordVisible,
                    onVisibleChange: setPasswordVisible,
                  }}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <span className="sp5">Confirm Password</span>
              <Form.Item name="cpassword" style={{ marginBottom: "10px" }}>
                <Input.Password
                  value={confirm}
                  placeholder=""
                  visibilityToggle={{
                    visible: passwordVisible2,
                    onVisibleChange: setPasswordVisible2,
                  }}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </Form.Item>
              <div className="terms">
                <span><Checkbox onChange={handleAgreement}></Checkbox></span>
                <p>
                  By clicking SignUp, you agree to our
                  <a> terms and condition </a>
                  and that you have read our <a> Privacy Policy </a>
                </p>
              </div>
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
                <ConfigProvider
                  theme={{
                    token: {
                      fontFamily: "Raleway",
                      fontSize: "15px",
                    },
                  }}
                >
                  <Button
                    size={"large"}
                    type="primary"
                    disabled={!agreement}
                    block
                    style={{ backgroundColor: "#2f234f" }}
                    htmlType="submit"
                  >
                    Sign Up
                  </Button>
                </ConfigProvider>
              )}
              <div className="login-account">
                <p>
                  Already have an account?
                  <span onClick={() => Navigate("/login")}>Login here</span>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
