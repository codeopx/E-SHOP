import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  getCountFromServer,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/pages/details.css";
import PuffLoader from "react-spinners/PuffLoader";
import { Rate, Space, message } from "antd";
import { motion } from "framer-motion";
import { AiOutlineShopping } from "react-icons/ai";
import { MdOutlineDeliveryDining, MdOutlineFavorite } from "react-icons/md";
import { UserAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = UserAuth();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    id && productDetail();
  }, [id]);

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
  const getSaved = async () => {
    if (!user) {
      return;
    } else {
      const productRef = collection(db, "saved_products");
      const featuredQuery = query(
        productRef,
        where("productID", "==", id),
        where("id", "==", user?.uid)
      );
      const querySnapshots = await getDocs(featuredQuery);
      let items = [];
      querySnapshots.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setSaved(items);
      console.log(items);
    }
  };
  useEffect(() => {
    getSaved();
    return () => {
      getSaved();
    };
  }, [saved]);
  const saveItem = async (
    name,
    price,
    image,
    brand,
    added,
    category,
    description,
    productID,
    quantity,
    rated,
    rating
  ) => {
    const docRef = await addDoc(collection(db, "saved_products"), {
      name: name,
      price: price,
      category: category,
      brand: brand,
      description: description,
      quantity: quantity,
      added: serverTimestamp(),
      rating: rating,
      rated: rated,
      image: image,
      productID: productID,
      id: user?.uid,
    });
    await updateDoc(doc(db, "saved_products", docRef.id), {
      savedID: docRef.id,
    });
    messageApi.open({
      type: "success",
      content: "Product saved to favourites",
    });
  };

  const cartItems = async (productID, name, price, image, rating, brand) => {
    if (!user) {
      messageApi.open({
        type: "error",
        content: "Please login to access cart features",
      });
    } else {
      var cart = 0;
      const productRef = collection(db, "cart");
      const featuredQuery = query(
        productRef,
        where("productID", "==", productID),
        where("id", "==", user?.uid)
      );
      const querySnapshots = await getCountFromServer(featuredQuery);
      cart = querySnapshots.data().count;
      console.log(cart);
      console.log(productID);

      if (cart >= 1) {
        messageApi.open({
          type: "error",
          content: "Product already added to cart",
        });
      } else {
        const docRef = await addDoc(collection(db, "cart"), {
          name: name,
          price: Number(price),
          image: image,
          rating: rating,
          brand: brand,
          productID: productID,
          id: user?.uid,
          quantity: 1,
        });
        await updateDoc(doc(db, "cart", docRef.id), {
          cartID: docRef.id,
        });
        messageApi.open({
          type: "success",
          content: "Product added to cart",
        });
      }
    }
  };

  const buy = async (productID, name, price, image, rating, brand) => {
    if (!user) {
      messageApi.open({
        type: "error",
        content: "Please register to checkout",
      });
    } else {
      const docRef = await addDoc(collection(db, "cart"), {
        name: name,
        price: Number(price),
        image: image,
        rating: rating,
        brand: brand,
        productID: productID,
        id: user?.uid,
        quantity: 1,
      });
      await updateDoc(doc(db, "cart", docRef.id), {
        cartID: docRef.id,
      });
      navigate("/checkout");
    }
  };

  if (saved.length === 0) {
    if (loading) {
      return (
        <div className="spinner">
          <PuffLoader color={"#2f234f"} loading={loading} size={60} />
        </div>
      );
    }
    return (
      <div className="products-details">
        {contextHolder}
        <h1>
          {product?.category + " / " + product?.brand + " / " + product?.name}
        </h1>
        <div className="product-details-row">
          <div className="product-details-image">
            <img src={product?.image} alt="" />
          </div>
          <div className="product-details-text">
            <div className="product-details-text-row">
              <h1>{product?.name}</h1>
              {!user ? (
                <></>
              ) : (
                <span
                  onClick={() =>
                    saveItem(
                      product?.name,
                      product?.price,
                      product?.image,
                      product?.brand,
                      product?.added,
                      product?.category,
                      product?.description,
                      product?.productID,
                      product?.quantity,
                      product?.rated,
                      product?.rating
                    )
                  }
                >
                  <MdOutlineFavoriteBorder />
                </span>
              )}
            </div>
            <div className="products-details-desc">
              <p>{product?.description}</p>
              <Space style={{ marginTop: "10px" }}>
                <Rate
                  disabled
                  allowHalf
                  value={
                    product?.rating.length > 0
                      ? product?.rating.reduce((a, b) => a + b, 0) /
                        product?.rating.length
                      : 0
                  }
                  style={{ color: "#2f234f", fontSize: 12 }}
                />
                <h3 className="product-reviews-text">
                  {product?.rating.length === 1
                    ? product?.rating.length + " review"
                    : product?.rating.length + " reviews"}
                </h3>
              </Space>
            </div>
            <h4>{"₦" + product?.price}</h4>
            <div className="product-delivery-box">
              <div className="p-d-box-icon">
                <span>
                  <MdOutlineDeliveryDining />
                </span>
              </div>
              <div className="p-d-box-text">
                <h5>Free delivery</h5>
                <h6>Enter your postal code for delivery availability</h6>
              </div>
            </div>
            <div className="product-delivery-box1">
              <div className="p-d-box-icon">
                <span>
                  <AiOutlineShopping />
                </span>
              </div>
              <div className="p-d-box-text">
                <h5>Return delivery</h5>
                <h6>Free 30days Delivery Returns</h6>
              </div>
            </div>
            <Space>
              <motion.button
                onClick={() =>
                  buy(
                    product?.productID,
                    product?.name,
                    product?.price,
                    product?.image,
                    product?.rating,
                    product?.brand
                  )
                }
                whileHover={{ scale: 1.1 }}
                className="product-b-button"
              >
                Buy Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="product-c-button"
                onClick={() =>
                  cartItems(
                    product?.productID,
                    product?.name,
                    product?.price,
                    product?.image,
                    product?.rating,
                    product?.brand
                  )
                }
              >
                Add to Cart
              </motion.button>
            </Space>
          </div>
        </div>
      </div>
    );
  } else {
    if (loading) {
      return (
        <div className="spinner">
          <PuffLoader color={"#2f234f"} loading={loading} size={60} />
        </div>
      );
    }
    return (
      <div className="products-details">
        {contextHolder}
        <h1>
          {product?.category + " / " + product?.brand + " / " + product?.name}
        </h1>
        <div className="product-details-row">
          <div className="product-details-image">
            <img src={product?.image} alt="" />
          </div>
          <div className="product-details-text">
            <div className="product-details-text-row">
              <h1>{product?.name}</h1>
              {!user ? (
                <></>
              ) : (
                <span>
                  <MdOutlineFavorite color="red" />
                </span>
              )}
            </div>
            <div className="products-details-desc">
              <p>{product?.description}</p>
              <Space style={{ marginTop: "10px" }}>
                <Rate
                  disabled
                  allowHalf
                  value={
                    product?.rating.length > 0
                      ? product?.rating.reduce((a, b) => a + b, 0) /
                        product?.rating.length
                      : 0
                  }
                  style={{ color: "#2f234f", fontSize: 12 }}
                />
                <h3 className="product-reviews-text">
                  {product?.rating.length === 1
                    ? product?.rating.length + " review"
                    : product?.rating.length + " reviews"}
                </h3>
              </Space>
            </div>
            <h4>{"₦" + product?.price}</h4>
            <div className="product-delivery-box">
              <div className="p-d-box-icon">
                <span>
                  <MdOutlineDeliveryDining />
                </span>
              </div>
              <div className="p-d-box-text">
                <h5>Free delivery</h5>
                <h6>Enter your postal code for delivery availability</h6>
              </div>
            </div>
            <div className="product-delivery-box1">
              <div className="p-d-box-icon">
                <span>
                  <AiOutlineShopping />
                </span>
              </div>
              <div className="p-d-box-text">
                <h5>Return delivery</h5>
                <h6>Free 30days Delivery Returns</h6>
              </div>
            </div>
            <Space>
              <motion.button
                onClick={() =>
                  buy(
                    product?.productID,
                    product?.name,
                    product?.price,
                    product?.image,
                    product?.rating,
                    product?.brand
                  )
                }
                whileHover={{ scale: 1.1 }}
                className="product-b-button"
              >
                Buy Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="product-c-button"
                onClick={() =>
                  cartItems(
                    product?.productID,
                    product?.name,
                    product?.price,
                    product?.image,
                    product?.rating,
                    product?.brand
                  )
                }
              >
                Add to Cart
              </motion.button>
            </Space>
          </div>
        </div>
      </div>
    );
  }
};

export default ProductDetail;
