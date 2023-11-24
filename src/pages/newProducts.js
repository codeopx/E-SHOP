import "../styles/pages/shop.css";
import { Select, Input, Button } from "antd";
import { BsSearch } from "react-icons/bs";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import ShopProducts from "../components/shopProducts";

const NewProducts = () => {
  const [sort, setSort] = useState("");
  const [def, setDef] = useState("Sort By");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const clear = () => {
    window.location.reload(false);
  };
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

  const searchProducts = (e) => {
    setSort("S");
    setSearchTerm(e.target.value);
  };

  if (sort === "hp") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>New Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button>
                <Select
                  onChange={(value) => {
                    setSort(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
                >
                  <Select.Option value="hp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Highest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="lp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Lowest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="az">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      A-Z
                    </span>
                  </Select.Option>
                  <Select.Option value="za">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Z-A
                    </span>
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
                  suffix={<BsSearch />}
                  placeholder="Search..."
                  bordered={false}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Highest />
          </div>
        </section>
      </div>
    );
  } else if (sort === "lp") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>New Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button>
                <Select
                  onChange={(value) => {
                    setSort(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
                >
                  <Select.Option value="hp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Highest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="lp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Lowest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="az">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      A-Z
                    </span>
                  </Select.Option>
                  <Select.Option value="za">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Z-A
                    </span>
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
                  suffix={<BsSearch />}
                  placeholder="Search..."
                  bordered={false}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <Lowest />
          </div>
        </section>
      </div>
    );
  } else if (sort === "az") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>New Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button>
                <Select
                  onChange={(value) => {
                    setSort(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
                >
                  <Select.Option value="hp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Highest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="lp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Lowest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="az">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      A-Z
                    </span>
                  </Select.Option>
                  <Select.Option value="za">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Z-A
                    </span>
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
                  suffix={<BsSearch />}
                  placeholder="Search..."
                  bordered={false}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <AZ />
          </div>
        </section>
      </div>
    );
  } else if (sort === "za") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>New Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button>
                <Select
                  onChange={(value) => {
                    setSort(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
                >
                  <Select.Option value="hp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Highest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="lp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Lowest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="az">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      A-Z
                    </span>
                  </Select.Option>
                  <Select.Option value="za">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Z-A
                    </span>
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
                  suffix={<BsSearch />}
                  placeholder="Search..."
                  bordered={false}
                />
              </button> */}
            </div>
          </div>
          <div className="products-section-wrap">
            <ZA />
          </div>
        </section>
      </div>
    );
  } else if (sort === "S") {
    return (
      <div className="shop-section">
        <section className="image-section">
          <h2>New Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button>
                <Select
                  onChange={(value) => {
                    setSort(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
                >
                  <Select.Option value="hp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Highest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="lp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Lowest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="az">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      A-Z
                    </span>
                  </Select.Option>
                  <Select.Option value="za">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Z-A
                    </span>
                  </Select.Option>
                </Select>
              </button>
            </div>
            <div className="p-s-i-row2">
              <button>
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
          <h2>New Products</h2>
        </section>
        <section className="products-section">
          <div className="products-section-inputs">
            <div className="p-s-i-row1">
              <button>
                <Select
                  onChange={(value) => {
                    setSort(value);
                  }}
                  defaultValue={def}
                  bordered={false}
                  className="s"
                >
                  <Select.Option value="hp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Highest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="lp">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Lowest Price
                    </span>
                  </Select.Option>
                  <Select.Option value="az">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      A-Z
                    </span>
                  </Select.Option>
                  <Select.Option value="za">
                    <span
                      style={{
                        fontWeight: "600",
                        fontFamily: "Raleway, sans-serif ",
                      }}
                    >
                      Z-A
                    </span>
                  </Select.Option>
                </Select>
              </button>
            </div>
            <div className="p-s-i-row2">
              <button>
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

export default NewProducts;

const Highest = () => {
  const [highest, setHighest] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, orderBy("price", "desc"));
    const querySnapshots = await getDocs(featuredQuery);
    let highest = [];
    querySnapshots.forEach((doc) => {
      highest.push({ id: doc.id, ...doc.data() });
    });
    setHighest(highest);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={highest} />
    </div>
  );
};
const Lowest = () => {
  const [lowest, setLowest] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, orderBy("price"));
    const querySnapshots = await getDocs(featuredQuery);
    let lowest = [];
    querySnapshots.forEach((doc) => {
      lowest.push({ id: doc.id, ...doc.data() });
    });
    setLowest(lowest);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={lowest} />
    </div>
  );
};
const AZ = () => {
  const [az, setAz] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, orderBy("name"));
    const querySnapshots = await getDocs(featuredQuery);
    let az = [];
    querySnapshots.forEach((doc) => {
      az.push({ id: doc.id, ...doc.data() });
    });
    setAz(az);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={az} />
    </div>
  );
};

const ZA = () => {
  const [za, setZa] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, orderBy("name", "desc"));
    const querySnapshots = await getDocs(featuredQuery);
    let za = [];
    querySnapshots.forEach((doc) => {
      za.push({ id: doc.id, ...doc.data() });
    });
    setZa(za);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={za} />
    </div>
  );
};
const None = () => {
  const [none, setNone] = useState([]);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, orderBy("added", "desc"));
    const querySnapshots = await getDocs(featuredQuery);
    let none = [];
    querySnapshots.forEach((doc) => {
      none.push({ id: doc.id, ...doc.data() });
    });
    setNone(none);
  };

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  return (
    <div className="products-section-wrap">
      <ShopProducts products={none} />
    </div>
  );
};
