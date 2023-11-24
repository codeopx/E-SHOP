import { Form, Input, ConfigProvider, Space, Button } from "antd";
import { db} from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../../styles/pages/driver/driverAccount.css";
import { useState, useEffect } from "react";
import { UserAuth } from "../../context/authContext";
import PuffLoader from "react-spinners/PuffLoader";
import { useNavigate } from "react-router-dom";
const DriverAccount = () => {
  const { user } = UserAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [_loading, set_Loading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [number, setNumber] = useState("");
  const [users, setUsers] = useState("");

  const update = async () => {
    try {
      set_Loading(true);
      await updateDoc(doc(db, "users", user?.uid), {
        name: name,
        email: email,
        phone: phone,
        number: number,
      });
      set_Loading(false);
      navigate('/driver-dashboard')
    } catch (error) {
      console.log(error);
    }
  };

  const userDetail = async () => {
    try {
      const docRef = doc(db, "users", user?.uid);
      const productDetail = await getDoc(docRef);
      setUsers(productDetail.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    userDetail();
    return () => {
      userDetail();
    };
  }, []);
  useEffect(() => {
    form.setFieldsValue({
      Names: users?.name,
      email: users?.email,
      phone: users?.phone,
      no: users?.number,
    });
    setName(users?.name);
    setEmail(users?.email);
    setPhone(users?.phone);
    setNumber(users?.number);
  }, [users, form]);
  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color={"#2f234f"} loading={loading} size={60} />
      </div>
    );
  }
  return (
    <div className="driver-account-screen">
      <h1>Update Details</h1>
      <ConfigProvider
        button={{
          token: {
            controlHeight: 200,
          },
        }}
        theme={{
          token: {
            fontFamily: "Raleway",
            controlHeight: 50,
            colorPrimary: "#2f234f",
          },
        }}
      >
        <Form
          layout="vertical"
          size={"small"}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 50 }}
          className="driver-form"
          form={form}
          onFinish={update}
        >
          <Form.Item
            label="Names"
            name="Names"
            style={{ marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: "Please enter a valid name",
              },
            ]}
          >
            <Input
              style={{ fontWeight: "600" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Display email"
            name="email"
            style={{ marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input
              style={{ fontWeight: "600" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Phone Number"
            name="phone"
            style={{ marginBottom: "10px" }}
            rules={[
              {
                required: true,
                message: "Please enter a valid phone no",
              },
            ]}
          >
            <Input
              style={{ fontWeight: "600" }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Vehicle number"
            name="no"
            style={{ marginBottom: "40px" }}
            rules={[
              {
                required: true,
                message: "Please enter a valid number",
              },
            ]}
          >
            <Input
              style={{ fontWeight: "600" }}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </Form.Item>
          {_loading ? (
            <Button
              style={{
                fontWeight: "800",
                backgroundColor: "#2f234f",
                paddingRight: "37%",
                paddingLeft: "37%",
              }}
              type="primary"
              htmlType="submit"
              loading
              disabled
            >
              Edit Account
            </Button>
          ) : (
            <Button
              style={{
                fontWeight: "800",
                backgroundColor: "#2f234f",
                paddingRight: "37%",
                paddingLeft: "37%",
              }}
              type="primary"
              htmlType="submit"
            >
              Edit Account
            </Button>
          )}
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default DriverAccount;
