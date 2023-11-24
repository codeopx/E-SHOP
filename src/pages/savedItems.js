import { useState, useEffect } from "react";
import "../styles/pages/shop.css";
import { Select, Input, Button } from "antd";
import { BsSearch } from "react-icons/bs";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from "../firebase";
import ShopProducts from "../components/shopProducts";
import { UserAuth } from "../context/authContext";

const SavedItems = () => {
  const [saved, setSaved] = useState([]);
  const { user } = UserAuth();

  const getProducts = async () => {
    const productRef = collection(db, "saved_products");
    const featuredQuery = query(productRef, where("id", "==", user?.uid));
    const querySnapshots = await getDocs(featuredQuery);
    let items = [];
    querySnapshots.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() });
    });
    setSaved(items);
  };
  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, [saved]);
  return (
    <div className="shop-section">
      <section className="image-section">
        <h2>Saved Items</h2>
      </section>
      <section className="products-section">
        <div className="products-section-wrap">
            <ShopProducts products={saved} />
        </div>
      </section>
    </div>
  );
};

export default SavedItems;
