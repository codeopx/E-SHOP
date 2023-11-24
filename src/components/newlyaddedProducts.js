import "../styles/components/featuredProducts.css";
import { motion } from "framer-motion";
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";
import { excerpt } from "../utility";
import {
  collection,
  query,
  where,
  addDoc,
  getCountFromServer,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { message } from "antd";
import { UserAuth } from "../context/authContext";

const NewlyAdded = ({ products }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = UserAuth();

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
        where("id", "==", user?.uid),
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
  const navigate = useNavigate();
  return (
    <>
      {contextHolder}
      {products.map((item) => (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          className="product-card"
        >
          <div
            onClick={() => navigate(`/details/${item.productID}`)}
            className="product-card-image"
          >
            <img src={item.image} alt="" />
          </div>
          <div className="product-card-details">
            <div className="products-card-d-r1">
              <h2>{excerpt(item.name, 12)}</h2>
              <h2>{"₦" + item.price.toLocaleString()}</h2>
            </div>
            <Rate
              className={"rate"}
              disabled
              allowHalf
              value={
                item.rating.length > 0
                  ? item.rating.reduce((a, b) => a + b, 0) / item.rating.length
                  : 0
              }
              style={{ color: "#2f234f", fontSize: 10 }}
            />
            <div className="product-button-row">
              <button
                onClick={() =>
                  cartItems(
                    item.productID,
                    item.name,
                    item.price,
                    item.image,
                    item.rating,
                    item.brand
                  )
                }
                className="product-button"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default NewlyAdded;
