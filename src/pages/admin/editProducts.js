import { useParams, useNavigate } from "react-router-dom";
import { db, storage } from "../../firebase";
import PuffLoader from "react-spinners/PuffLoader";
import SideBar from "../../components/sidebar";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { BsUpload } from "react-icons/bs";
import "../../styles/pages/admin/adminCreate.css";
import {
  Form,
  Input,
  ConfigProvider,
  Select,
  Radio,
  Space,
  Button,
  message,
} from "antd";

const { TextArea } = Input;

const EditProducts = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [_loading, set_Loading] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [featured, setFeatured] = useState(false);

  const update = async () => {
    try {
      set_Loading(true);
      if (selectedImage.length === 0) {
        await updateDoc(doc(db, "products", id), {
          name: name,
          price: Number(price),
          category: category,
          brand: brand,
          description: description,
          quantity: Number(quantity),
          featured: featured,
        });
        set_Loading(false);
        navigate("/view-products");
      } else {
        await Promise.all(
          selectedImage.map((image) => {
            const imageRef = ref(storage, `products/${image.path}`);
            uploadBytes(imageRef, image, "data_url").then(async () => {
              const downloadURL = await getDownloadURL(imageRef);
              await updateDoc(doc(db, "products", id), {
                image: downloadURL,
                name: name,
                price: Number(price),
                category: category,
                brand: brand,
                description: description,
                quantity: Number(quantity),
                featured: featured,
              });
            });
          })
        );
        set_Loading(false);
        navigate("/view-products");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    id && productDetail();
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({
      ProductName: product?.name,
      ProductPrice: product?.price,
      Category: product?.category,
      Brand: product?.brand,
      featured: product?.featured,
      Quantity: product?.quantity,
      Desc: product?.description,
    });
    setName(product?.name);
    setPrice(product?.price);
    setCategory(product?.category);
    setBrand(product?.brand);
    setDescription(product?.description);
    setQuantity(product?.quantity);
    setFeatured(product?.featured);

  }, [product, form]);

  const productDetail = async () => {
    try {
      const docRef = doc(db, "products", id);
      const productDetail = await getDoc(docRef);
      setProduct(productDetail.data());
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#2f234f",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const focusedStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };
  const onDrop = useCallback((acceptedFiles) => {
    setSelectedImage(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: "image/*",
      maxFiles: 1,
    });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );
  const selected_image = selectedImage?.map((file) => (
    <div className="dropzone-container">
      <img src={file.preview} alt="" className="dropzone-image" />
    </div>
  ));
  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color={"#2f234f"} loading={loading} size={60} />
      </div>
    );
  }
  return (
    <div className="createP-screen">
      <SideBar />
      <div className="createP-container">
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
          <div className="createP-details">
            <h1>Hey, There!</h1>
            <h2>Edit Products on your online store</h2>
          </div>
          <Form
            form={form}
            className="detailsform"
            onSubmit={(e) => e.preventDefault()}
            layout="vertical"
            size={"small"}
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 50 }}
            onFinish={update}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{ display: "flex" }}
            >
              <span>Product Image</span>
              <div>
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  <div className="dragdrop">
                    <div className="dragdrop-icon">
                      <BsUpload />
                    </div>
                    <h1>
                      Drag & Drop or <span>Choose file</span> to upload
                    </h1>
                    <h2>Maximum file size 2MB</h2>
                  </div>
                </div>
                {selected_image}
              </div>
            </Space>
            <Form.Item
              label="Product Name"
              name="ProductName"
              style={{ marginBottom: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter a valid product name",
                },
              ]}
            >
              <Input
                showCount
                maxLength={25}
                style={{ fontWeight: "600" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Product Price"
              name="ProductPrice"
              style={{ marginBottom: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter a valid price",
                },
              ]}
            >
              <Input
                style={{ fontWeight: "600" }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Category"
              name="Category"
              style={{ marginBottom: "10px" }}
              labelCol
              rules={[
                {
                  required: true,
                  message: "Please enter a valid Category",
                },
              ]}
            >
              <Select
                onChange={(value) => {
                  setCategory(value);
                }}
                style={{ fontSize: "90px" }}
              >
                <Select.Option value="Mobile Phones">
                  <span style={{ fontWeight: "600" }}>Mobile Phones</span>
                </Select.Option>
                <Select.Option value="Accessories">
                  <span style={{ fontWeight: "600" }}>Accessories</span>
                </Select.Option>
                <Select.Option value="Laptops">
                  <span style={{ fontWeight: "600" }}>Laptops</span>
                </Select.Option>
                <Select.Option value="Television && Tablets">
                  <span style={{ fontWeight: "600" }}>
                    Television && Tablets
                  </span>
                </Select.Option>
                <Select.Option value="Audio">
                  <span style={{ fontWeight: "600" }}>Audio</span>
                </Select.Option>
                <Select.Option value="Power">
                  <span style={{ fontWeight: "600" }}>Power</span>
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Brand"
              name="Brand"
              style={{ marginBottom: "10px" }}
              rules={[
                {
                  required: true,
                  message: "Please enter a valid brand",
                },
              ]}
            >
              <Input
                style={{ fontWeight: "600" }}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Product Description"
              name="Desc"
              style={{ marginBottom: "10px" }}
              labelCol
              rules={[
                {
                  required: true,
                  message: "Please enter a valid description",
                },
              ]}
            >
              <TextArea
                allowClear
                showCount
                maxLength={450}
                style={{ fontWeight: "600" }}
                autoSize={{ minRows: 5, maxRows: 5 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Product Quantity"
              name="Quantity"
              style={{ marginBottom: "10px" }}
              labelCol
              rules={[
                {
                  required: true,
                  message: "Please enter a valid number",
                },
              ]}
            >
              <Input
                style={{ fontWeight: "600" }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              label="Do you want your product to be in the featured section?"
              name="featured"
              style={{ marginBottom: "50px" }}
              labelCol
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Radio.Group
                onChange={(e) => {
                  setFeatured(e.target.value);
                }}
                value={featured}
              >
                <Space direction="vertical">
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            {_loading ? (
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
                Edit Product
              </Button>
            ) : (
              <Button
                style={{
                  fontWeight: "800",
                  backgroundColor: "#2f234f",
                  paddingRight: "80px",
                  paddingLeft: "80px",
                }}
                type="primary"
                htmlType="submit"
              >
                Edit Product
              </Button>
            )}
          </Form>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default EditProducts;
