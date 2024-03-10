import "../styles/pages/cart.css";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  where,
  onSnapshot,
  getAggregateFromServer,
  query,
  sum,
} from "firebase/firestore";
import { db } from "../firebase";
import { UserAuth } from "../context/authContext";
import CartProducts from "../components/cartProducts";
import { Tooltip } from "antd";
import { AiOutlineInfoCircle } from "react-icons/ai";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = UserAuth();
  const navigate = useNavigate();

  const checkCart = async () => {
    const q = query(collection(db, "cart"), where("id", "==", user?.uid));
    let featured = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        featured.push({ id: doc.id, ...doc.data() });
        setCart(featured);
        console.log(cart);
      });
    });
  };
  const getSum = async () => {
    const coll = collection(db, "cart");
    const q = query(coll, where("id", "==", user?.uid));
    const snapshot = await getAggregateFromServer(q, {
      total: sum("price"),
    });
    setTotal(snapshot.data().total);
    console.log(snapshot.data().total)
  };

  useEffect(() => {
    checkCart();
    getSum();
    return () => {
      checkCart();
      getSum();
    };
  }, [cart]);


  return (
    <div className="cart-details">
      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3 }}
        whileInView={{ scale: 1, opacity: 1 }}
      >
        Cart
      </motion.h1>
      <div className="cart-details-Row">
        <div className="cart-detailsR-products">
          <CartProducts products={cart} />
        </div>
        <div className="cart-detailsR-checkout">
          <h1>Total</h1>
          <hr class="solid1"></hr>
          <div className="cart-details-R1">
            <h3>Sub-Total</h3>
            <h2>{total.toLocaleString()}</h2>
          </div>
          <div className="cart-details-R2">
            <h3>Delivery</h3>
            <Tooltip title="Delivery fees not included yet">
              <span>
                <AiOutlineInfoCircle />
              </span>
            </Tooltip>
          </div>
          <hr class="solid2"></hr>
          <div className="cart-details-R3">
            <h3>Total Price</h3>
            <h2>{total.toLocaleString()}</h2>
          </div>
          <hr class="solid3"></hr>
          <div className="button-row">
            <button
              onClick={() => navigate("/checkout")}
              className="cart-button"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
