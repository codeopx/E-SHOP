import { Button, ConfigProvider, Form, Input, Select } from "antd";
import SideBar from "../../components/sidebar";
import "../../styles/pages/admin/discountCreation.css";
import { useState } from "react";
import { db } from "../../firebase";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";

const DiscountCreation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState(0);

  const upload = async () => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "discounts"), {
        code: code,
        percentage: Number(percentage),
      });
      await updateDoc(doc(db, "discounts", docRef.id), {
        discountID: docRef.id,
      });
      setLoading(false);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-discount-screen">
      <SideBar />
      <div className="create-discount-Container">
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
          <div className="create-discount-details">
            <h1>Discounts & Coupons</h1>
            <h2>Create Discounts and Coupon for your online store</h2>
          </div>
          <Form
            form={form}
            className="detailsform"
            onSubmit={(e) => e.preventDefault()}
            layout="vertical"
            size={"small"}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 50 }}
            onFinish={upload}
          >
            <Form.Item
              label="Coupon Code"
              name="CouponCode"
              style={{ marginBottom: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter a valid code",
                },
              ]}
            >
              <Input
                style={{ fontWeight: "600" }}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Percentage"
              name="Percentage"
              style={{ marginBottom: "10px" }}
              labelCol
              rules={[
                {
                  required: true,
                  message: "Please enter a valid number",
                },
              ]}
            >
              <Select
                onChange={(value) => {
                  setPercentage(value);
                }}
                style={{ fontSize: "90px" }}
              >
                <Select.Option value={10}>
                  <span style={{ fontWeight: "600" }}>10</span>
                </Select.Option>
                <Select.Option value={20}>
                  <span style={{ fontWeight: "600" }}>20</span>
                </Select.Option>
                <Select.Option value={30}>
                  <span style={{ fontWeight: "600" }}>30</span>
                </Select.Option>
                <Select.Option value={40}>
                  <span style={{ fontWeight: "600" }}>40</span>
                </Select.Option>
                <Select.Option value={50}>
                  <span style={{ fontWeight: "600" }}>50</span>
                </Select.Option>
                <Select.Option value={60}>
                  <span style={{ fontWeight: "600" }}>60</span>
                </Select.Option>
                <Select.Option value={70}>
                  <span style={{ fontWeight: "600" }}>70</span>
                </Select.Option>
                <Select.Option value={80}>
                  <span style={{ fontWeight: "600" }}>80</span>
                </Select.Option>
                <Select.Option value={90}>
                  <span style={{ fontWeight: "600" }}>90</span>
                </Select.Option>
                <Select.Option value={100}>
                  <span style={{ fontWeight: "600" }}>100</span>
                </Select.Option>
              </Select>
            </Form.Item>
            {loading ? (
              <Button
                style={{
                  fontWeight: "800",
                  backgroundColor: "#2f234f",
                  paddingRight: "80px",
                  paddingLeft: "80px",
                }}
                type="primary"
                htmlType="submit"
                loading
                disabled
              >
                Uploading.....
              </Button>
            ) : (
              <Button
                style={{
                  fontWeight: "800",
                  backgroundColor: "#2f234f",
                  paddingRight: "80px",
                  paddingLeft: "80px",
                  marginTop: "30px",
                }}
                type="primary"
                htmlType="submit"
              >
                Upload
              </Button>
            )}
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};
export default DiscountCreation;
