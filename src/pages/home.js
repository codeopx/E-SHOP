import "../styles/pages/home.css";
import { motion } from "framer-motion";
import Intro from "../styles/images/intro-image.png";
import Audio from "../styles/images/audio.jpeg";
import Mobile from "../styles/images/mobile-phones.jpg";
import Laptop from "../styles/images/laptop.jpeg";
import Power from "../styles/images/power.jpeg";
import Television from "../styles/images/television.jpeg";
import Accessories from "../styles/images/accessories.jpg";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  limit,
  query,
  orderBy,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase";
import FeaturedProducts from "../components/featuredProducts";
import NewlyAdded from "../components/newlyaddedProducts";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [newlyadded, setnewlyadded] = useState([]);
  //// category count
  const [mobile, setMobile] = useState(0);
  const [accessories, setAccessories] = useState(0);
  const [laptops, setLaptops] = useState(0);
  const [Televisons, setTelevision] = useState(0);
  const [AudioE, setAudioE] = useState(0);
  const [power, setPower] = useState(0);

  const getMobile = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("category", "==", "Mobile Phones")
    );
    const querySnapshots = await getCountFromServer(featuredQuery);
    setMobile(querySnapshots.data().count);
  };
  const getAccessories = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("category", "==", "Accessories")
    );
    const querySnapshots = await getCountFromServer(featuredQuery);
    setAccessories(querySnapshots.data().count);
  };
  const getLaptops = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("category", "==", "Laptops"));
    const querySnapshots = await getCountFromServer(featuredQuery);
    setLaptops(querySnapshots.data().count);
  };
  const getTelevisons = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("category", "==", "Television && Tablets")
    );
    const querySnapshots = await getCountFromServer(featuredQuery);
    setTelevision(querySnapshots.data().count);
  };
  const getAudio = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("category", "==", "Audio"));
    const querySnapshots = await getCountFromServer(featuredQuery);
    setAudioE(querySnapshots.data().count);
  };
  const getPower = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("category", "==", "Power"));
    const querySnapshots = await getCountFromServer(featuredQuery);
    setPower(querySnapshots.data().count);
  };

  const getFeaturedProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("featured", "==", true),
      limit(5)
    );
    const querySnapshots = await getDocs(featuredQuery);
    let featured = [];
    querySnapshots.forEach((doc) => {
      featured.push({ id: doc.id, ...doc.data() });
    });
    setFeatured(featured);
  };

  const getNewlyAddedProducts = async () => {
    const productRef = collection(db, "products");
    const newQuery = query(productRef, orderBy("added", "desc"), limit(10));
    const querySnapshots = await getDocs(newQuery);
    let newlyadded = [];
    querySnapshots.forEach((doc) => {
      newlyadded.push({ id: doc.id, ...doc.data() });
    });
    setnewlyadded(newlyadded);
  };

  useEffect(() => {
    getFeaturedProducts();
    getMobile();
    getAccessories();
    getLaptops();
    getTelevisons();
    getAudio();
    getPower();
    return () => {
      //unsub();
      getFeaturedProducts();
      getNewlyAddedProducts();
      getMobile();
      getAccessories();
      getLaptops();
      getTelevisons();
      getAudio();
      getPower();
    };
  }, []);

  return (
    <div>
      <section className="main">
        <motion.div
          className="main-text"
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          <h1>Grab Upto 50% Off On Selected Headphones</h1>
          <motion.button whileHover={{ scale: 1.2 }} className="button">
            Buy Now
          </motion.button>
        </motion.div>
        <div className="img-container">
          <motion.img
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            src={Intro}
            alt=""
          />
        </div>
      </section>
      <section className="featured-products">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          Featured Products
        </motion.h1>
        <div className="featured-productsC">
          <FeaturedProducts products={featured} />
        </div>
      </section>
      <section className="just-arrived">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          Just Arrived
        </motion.h1>
        <div className="justArrived-productsC">
          <NewlyAdded products={newlyadded} />
        </div>
      </section>
      <section className="categories">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          whileInView={{ scale: 1, opacity: 1 }}
        >
          Popular Categories
        </motion.h1>
        <div className="categories-wrap">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="cat-1"
            onClick={() => navigate("/shop")}
          >
            <div className="cat-image-box">
              <img src={Mobile} alt="" />
            </div>
            <div className="cat-text-box">
              <h6>Mobile Phones</h6>
              <h4>{mobile + " Products Available"}</h4>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="cat-2"
            onClick={() => navigate("/shop")}
          >
            <div className="cat-image-box">
              <img src={Laptop} alt="" />
            </div>
            <div className="cat-text-box">
              <h6>Laptops</h6>
              <h4>{laptops + " Products Available"}</h4>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="cat-3"
            onClick={() => navigate("/shop")}

          >
            <div className="cat-image-box">
              <img src={Audio} alt="" />
            </div>
            <div className="cat-text-box">
              <h6>Audio</h6>
              <h4>{AudioE + " Products Available"}</h4>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="cat-4"
            onClick={() => navigate("/shop")}

          >
            <div className="cat-image-box">
              <img src={Television} alt="" />
            </div>
            <div className="cat-text-box">
              <h6>Television & Tablets</h6>
              <h4>{Televisons + " Products Available"}</h4>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="cat-5"
            onClick={() => navigate("/shop")}

          >
            <div className="cat-image-box">
              <img src={Power} alt="" />
            </div>
            <div className="cat-text-box">
              <h6>Power</h6>
              <h4>{power + " Products Available"}</h4>
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="cat-6"
            onClick={() => navigate("/shop")}
          >
            <div className="cat-image-box">
              <img src={Accessories} alt="" />
            </div>
            <div className="cat-text-box">
              <h6>Accessories</h6>
              <h4>{accessories + " Products Available"}</h4>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
