import "../styles/pages/shop.css";
import { Select, Input, Button } from "antd";
import { BsSearch } from "react-icons/bs";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import ShopProducts from "../components/shopProducts";

const Shop = () => {
  const [filter, setFilter] = useState("");
  const [def, setDef] = useState("Filter By Category");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(db, "products"),
        where("name", ">=", searchTerm),
        where("name", "<=", searchTerm + "\uf8ff")
      );
      let search = [];
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          search.push({ id: doc.id, ...doc.data() });
          setSearchResults(search);
        });
      });
    };
    fetchData();
  }, [searchTerm]);

  const clear = () => {
    window.location.reload(false);
  };

  const searchProducts = (e) => {
    setFilter("S");
    setSearchTerm(e.target.value);
  };

  if (filter === "Mobile Phones") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              {/* <button>
                <Input
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Mobile />
          </div>
        </section>
      </div>
    );
  } else if (filter === "Accessories") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              {/* <button>
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Accessories />
          </div>
        </section>
      </div>
    );
  } else if (filter === "Laptops") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              {/* <button>
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Laptops />
          </div>
        </section>
      </div>
    );
  } else if (filter === "Television && Tablets") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              {/* <button>
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <TV />
          </div>
        </section>
      </div>
    );
  } else if (filter === "Audio") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              {/* <button>
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Audio />
          </div>
        </section>
      </div>
    );
  } else if (filter === "Power") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              {/* <button>
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Power />
          </div>
        </section>
      </div>
    );
  } else if (filter === "S") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
              <button onClick={clear} className="clear-btn">
                Clear Filters
              </button>
            </div>
            <div className="p-s-i-row2">
              <button className="button2">
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button>
            </div>
          </div>
          <div className="products-section-wrap">
            <ShopProducts products={searchResults} />
          </div>
        </section>
      </div>
    );
  } else {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button className="button">
                <Select
                  onChange={(value) => {
                    setFilter(value);
                    console.log(value);
                  }}
                  defaultValue="Filter By Category"
                  bordered={false}
                  className="s"
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
              </button>
            </div>
            <div className="p-s-i-row2">
              <button className="button2">
                <Input
                  value={searchTerm}
                  className="i"
                  suffix={<BsSearch onClick={searchProducts} />}
                  placeholder="Search..."
                  bordered={false}
                  onChange={searchProducts}
                />
              </button>
            </div>
          </div>
          <div className="products-section-wrap">
            <None />
          </div>
        </section>
      </div>
    );
  }
};

export default Shop;

const Mobile = () => {
  const [mobile, setMobile] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("category", "==", "Mobile Phones")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let mobile = [];
    querySnapshots.forEach((doc) => {
      mobile.push({ id: doc.id, ...doc.data() });
    });
    setMobile(mobile);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={mobile} />
    </div>
  );
};
const Accessories = () => {
  const [accessories, setAccessories] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("category", "==", "Accessories")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let accessories = [];
    querySnapshots.forEach((doc) => {
      accessories.push({ id: doc.id, ...doc.data() });
    });
    setAccessories(accessories);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={accessories} />
    </div>
  );
};
const Laptops = () => {
  const [laptop, setLaptop] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("category", "==", "Laptops"));
    const querySnapshots = await getDocs(featuredQuery);
    let laptop = [];
    querySnapshots.forEach((doc) => {
      laptop.push({ id: doc.id, ...doc.data() });
    });
    setLaptop(laptop);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={laptop} />
    </div>
  );
};
const TV = () => {
  const [tv, setTv] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(
      productRef,
      where("category", "==", "Television && Tablets")
    );
    const querySnapshots = await getDocs(featuredQuery);
    let tv = [];
    querySnapshots.forEach((doc) => {
      tv.push({ id: doc.id, ...doc.data() });
    });
    setTv(tv);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={tv} />
    </div>
  );
};
const Audio = () => {
  const [audio, setAudio] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("category", "==", "Audio"));
    const querySnapshots = await getDocs(featuredQuery);
    let audio = [];
    querySnapshots.forEach((doc) => {
      audio.push({ id: doc.id, ...doc.data() });
    });
    setAudio(audio);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={audio} />
    </div>
  );
};
const Power = () => {
  const [power, setPower] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("category", "==", "Power"));
    const querySnapshots = await getDocs(featuredQuery);
    let power = [];
    querySnapshots.forEach((doc) => {
      power.push({ id: doc.id, ...doc.data() });
    });
    setPower(power);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={power} />
    </div>
  );
};

const None = () => {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef);
    const querySnapshots = await getDocs(featuredQuery);
    let products = [];
    querySnapshots.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    setProducts(products);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={products} />
    </div>
  );
};

// const Search = ({ data }) => {
//   if (!products) {
//     return <div className="products-section-wrap">none</div>;
//   } else {
//     return (
//       <div className="products-section-wrap">
//         <ShopProducts products={products} />
//       </div>
//     );
//   }
// };
