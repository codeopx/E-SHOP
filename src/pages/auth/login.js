import '../../styles/pages/auth/login.css'
import { Button, Form, Input, Alert, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const Login = () => {
  const Navigate = useNavigate();
  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, msg: "" });

  const handleSubmit = async (e) => {
    setLoading(true);
    setMessage("");
    if (!email || !password) {
      setMessage({ error: true, msg: "All fields are required" });
      setLoading(false);
    } else {
      try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        form.resetFields();
        setLoading(false);
        setMessage("");
        if (result.user.emailVerified) {
          Navigate("/");
        } else {
          setMessage({
            error: true,
            msg: "Please check your email for your confirmation mail",
          });
        }
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
            <header>Welcome Back</header>
            <Form
              onFinish={handleSubmit}
              onSubmit={(e) => e.preventDefault()}
              layout="vertical"
              size={"large"}
              labelCol={{ span: 100 }}
              wrapperCol={{ span: 100 }}
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
                <span className="sp3">Email Address</span>
              </Space>
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
              <div className="forgot-password">
                <h3>Forgot password?</h3>
              </div>
              {loading ? (
                <Button
                  size={"large"}
                  type="primary"
                  block
                  loading
                  style={{ backgroundColor: "#2f234f" }}
                  htmlType="submit"
                >
                  Log In
                </Button>
              ) : (
                <Button
                  size={"large"}
                  type="primary"
                  block
                  style={{ backgroundColor: "#2f234f" }}
                  htmlType="submit"
                >
                  Log In
                </Button>
              )}
              <div className="login-account">
                <p>
                  Don't have an account yet?
                  <span onClick={() => Navigate("/sign-up")}>
                    Create account
                  </span>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
