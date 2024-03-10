import "../../styles/pages/auth/login.css";
import { Button, Form, Input, message, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      messageApi
        .open({
          type: "success",
          content: "Password reset email sent",
        })
        .then(() => {
          setLoading(false);
          Navigate("/login");
        });
    } catch (error) {
      setLoading(false);
      messageApi.open({
        type: "error",
        content: error.message,
      });
      form.resetFields();
    }
  };

  return (
    <>
      <section className="login-intro">
        {contextHolder}
        <div className="login-container">
          <div className="form-content">
            <header>Forgot Password?</header>
            <Form
              onFinish={handleSubmit}
              onSubmit={(e) => e.preventDefault()}
              layout="vertical"
              size={"large"}
              labelCol={{ span: 100 }}
              wrapperCol={{ span: 100 }}
              form={form}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{ display: "flex" }}
              >
                <span className="sp3">Email Address</span>
              </Space>
              <Form.Item name="email" style={{ marginBottom: "10px" }}>
                <Input
                  value={email}
                  placeholder=""
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              {loading ? (
                <Button
                  size={"large"}
                  type="primary"
                  block
                  loading
                  style={{ backgroundColor: "#2f234f" }}
                  htmlType="submit"
                >
                  Send email
                </Button>
              ) : (
                <Button
                  size={"large"}
                  type="primary"
                  block
                  style={{ backgroundColor: "#2f234f" }}
                  htmlType="submit"
                >
                  Send email
                </Button>
              )}
            </Form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
