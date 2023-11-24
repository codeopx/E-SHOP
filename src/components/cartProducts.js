import { motion } from "framer-motion";
import "../styles/components/cartProducts.css";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, increment, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const CartProducts = ({ products }) => {
  const navigate = useNavigate();

  const add = async (cartID, price,quantity) => {
    const old_price = price / quantity;
    if(quantity === 1){
      await updateDoc(doc(db, "cart", cartID), {
        quantity: increment(1),
        price: increment(price),
      });
      window.location.reload(false);
    }else{
      await updateDoc(doc(db, "cart", cartID), {
        quantity: increment(1),
        price: increment(old_price),
      });
      window.location.reload(false);
    };
    }
  const del = async (cartID, price, quantity) => {
    if (quantity === 1) {
      await deleteDoc(doc(db, "cart", cartID));
      window.location.reload(false);
    } else {
      const old_price = price / quantity;
      console.log(old_price);
      await updateDoc(doc(db, "cart", cartID), {
        quantity: increment(-1),
        price: increment(-old_price),
      });
      window.location.reload(false);
    }
  };
  const remove = async(cartID) => {
    await deleteDoc(doc(db, "cart", cartID));
    window.location.reload(false);
  }
  return (
    <>
      {products.map((item) => (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="cart-product-card"
        >
          <div
            onClick={() => navigate(`/details/${item.productID}`)}
            className="cart-product-image"
          >
            <img src={item.image} alt="" />
          </div>
          <div className="cart-product-details">
            <div className="cp-r1">
              <h1>{item.name}</h1>
              <h2>{item.brand}</h2>
              <div className="cp-row">
                <div className="cp1-controller">
                  <span>
                    <AiOutlinePlus
                      onClick={() => add(item.cartID, item.price,item.quantity)}
                    />
                  </span>
                  <h3>{item.quantity}</h3>
                  <span>
                    <AiOutlineMinus
                      onClick={() =>
                        del(item.cartID, item.price, item.quantity)
                      }
                    />
                  </span>
                </div>
                <RiDeleteBin5Line
                onClick={()=>remove(item.cartID)}
                className="delete" />
              </div>
            </div>
            <div className="cp-r2">
              <h5>{"₦" + item.price.toLocaleString()}</h5>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default CartProducts;
