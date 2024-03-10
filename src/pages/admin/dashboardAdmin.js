import SideBar from "../../components/sidebar";
import "../../styles/pages/admin/adminDashboard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getCountFromServer,
  getAggregateFromServer,
  query,
  sum,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase";
import { HiOutlineChartBar } from "react-icons/hi";
import { BsListCheck } from "react-icons/bs";
import { SiAtom } from "react-icons/si";
import { BiCubeAlt } from "react-icons/bi";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Filler,
  Legend,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { Button, ConfigProvider, Modal } from "antd";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sales, setSales] = useState(0);
  const [users, setUsers] = useState(0);
  const [products, setProducts] = useState(0);
  const [mobile, setMobile] = useState(0);
  const [accessories, setAccessories] = useState(0);
  const [laptops, setLaptops] = useState(0);
  const [Televisons, setTelevision] = useState(0);
  const [AudioE, setAudioE] = useState(0);
  const [power, setPower] = useState(0);
  const [order, setOrder] = useState([]);
  const [stock, setStock] = useState([]);
  const [pending, setPending] = useState(0);
  const [processing, setProcessing] = useState(0);
  const [transist, setTransist] = useState(0);
  const [delivered, setDelivered] = useState(0);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };
  const labels = ["Pending", "Processing", "Shipped", "Delivered"];
  const data2 = {
    labels,
    datasets: [
      {
        label: "Order Count",
        data: [pending, processing, transist, delivered],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const data = {
    labels: [
      "Mobile Phones",
      "Accessories",
      "Laptops",
      "Television && Tablets",
      "Audio",
      "Power",
    ],
    datasets: [
      {
        label: "Number of Products",
        data: [mobile, accessories, laptops, Televisons, AudioE, power],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const checkStock = async () => {
    var count;
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("quantity", "<=", 25));
    const querySnapshots = await getCountFromServer(featuredQuery);
    count = querySnapshots.data().count;
    console.log(count);
    if (count >= 1) {
      showStock();
    }
  };
  const showStock = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef, where("quantity", "<=", 25));
    const querySnapshots = await getDocs(featuredQuery);
    let products = [];
    querySnapshots.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    setStock(products);
    setIsModalOpen(true);
  };
  const showItems = async (id) => {
    var products;
    var placement = "top";
    const productRef = collection(db, "orderItems");
    const featuredQuery = query(productRef, where("orderID", "==", id));
    const querySnapshots = await getDocs(featuredQuery);
    let item = [];
    querySnapshots.forEach((doc) => {
      item.push({ id: doc.id, ...doc.data() });
    });
    products = item;
  };
  const getOrderss = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(productRef);
    const querySnapshots = await getDocs(featuredQuery);
    let products = [];
    querySnapshots.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    setOrder(products);
  };
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
  const getSales = async () => {
    const coll = collection(db, "order");
    const q = query(coll);
    const snapshot = await getAggregateFromServer(q, {
      total: sum("amount"),
    });
    setSales(snapshot.data().total);
  };

  const getOrders = async () => {
    const coll = collection(db, "order");
    const snapshot = await getCountFromServer(coll);
    setOrders(snapshot.data().count);
  };
  const getPending = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(productRef, where("status", "==", "pending"));
    const querySnapshots = await getCountFromServer(featuredQuery);
    setPending(querySnapshots.data().count);
  };
  const getProcessing = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(
      productRef,
      where("status", "==", "processing")
    );
    const querySnapshots = await getCountFromServer(featuredQuery);
    setProcessing(querySnapshots.data().count);
  };
  const getTransit = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(productRef, where("status", "==", "transit"));
    const querySnapshots = await getCountFromServer(featuredQuery);
    setTransist(querySnapshots.data().count);
  };
  const getCompleted = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(productRef, where("status", "==", "completed"));
    const querySnapshots = await getCountFromServer(featuredQuery);
    setDelivered(querySnapshots.data().count);
  };
  const getUsers = async () => {
    const coll = collection(db, "users");
    const snapshot = await getCountFromServer(coll);
    setUsers(snapshot.data().count);
  };
  const getProducts = async () => {
    const coll = collection(db, "products");
    const snapshot = await getCountFromServer(coll);
    setProducts(snapshot.data().count);
  };

  useEffect(() => {
    getSales();
    getOrders();
    getUsers();
    getProducts();
    getMobile();
    getAccessories();
    getLaptops();
    getTelevisons();
    getAudio();
    getPower();
    getOrderss();
    getCompleted();
    getPending();
    getProcessing();
    getTransit();
    checkStock();
    return () => {
      getSales();
      getOrders();
      getUsers();
      getProducts();
      getMobile();
      getAccessories();
      getLaptops();
      getTelevisons();
      getAudio();
      getPower();
      getOrderss();
      getCompleted();
      getPending();
      getProcessing();
      getTransit();
      checkStock();
    };
  }, []);
  return (
    <div className="dashboard-screen">
      <SideBar />
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "Raleway",
            colorPrimary: "#2f234f",
          },
        }}
      >
        <Modal
          title="Restocking Reminder...!"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <StockProducts products={stock}/>
        </Modal>
      </ConfigProvider>
      <div className="dashboard-container">
        <div className="dashboard-details">
          <h1>Dashboard</h1>
          <h2>Welcome to your dashboard</h2>
        </div>
        <div className="dashboard-details-row1">
          <div className="d-d-card">
            <div className="d-d-card-column">
              <h1>{orders}</h1>
              <h2>Orders Received</h2>
              <h4>All time</h4>
            </div>
            <div className="d-d-card-icon1">
              <BsListCheck />
            </div>
          </div>
          <div className="d-d-card">
            <div className="d-d-card-column">
              <h1>{"₦" + sales.toLocaleString()}</h1>
              <h2>Total Revenue</h2>
              <h4>All time</h4>
            </div>
            <div className="d-d-card-icon2">
              <HiOutlineChartBar />
            </div>
          </div>
          <div className="d-d-card">
            <div className="d-d-card-column">
              <h1>{users}</h1>
              <h2>Users</h2>
              <h4>All time</h4>
            </div>
            <div className="d-d-card-icon3">
              <SiAtom />
            </div>
          </div>
          <div className="d-d-card">
            <div className="d-d-card-column">
              <h1>{products}</h1>
              <h2>Total Products</h2>
              <h4>All time</h4>
            </div>
            <div className="d-d-card-icon4">
              <BiCubeAlt />
            </div>
          </div>
        </div>
        <div className="dashboard-details-row2">
          <div className="d-d2-card1">
            <h1>Order Status chart</h1>
            <Bar options={options} data={data2} className="barchart" />
          </div>
          <div className="d-d2-card2">
            <h1>Products by category</h1>
            <Doughnut data={data} className="doughnut" />
            <div className="d-d2-card-chart"></div>
          </div>
        </div>
        <div className="dashboard-details-row3">
          <div className="d-d3-card">
            <div className="details-row">
              <h1>Recent Orders</h1>
              <h3 onClick={() => navigate("/admin-orders")}>View all</h3>
            </div>
            <div className="details-p-row">
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Item(s)
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        OrderID
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Price
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Order Date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.orderID}
                          >
                            <Button
                              style={{ marginTop: "10px" }}
                              onClick={() => showItems(row.orderID)}
                            >
                              View Item(s)
                            </Button>
                            <TableCell align="left">{row.orderID}</TableCell>
                            <TableCell align="left">
                              {"₦" + row.amount.toLocaleString()}
                            </TableCell>
                            <TableCell align="left">{row.status}</TableCell>
                            <TableCell align="left">
                              {row.orderDate.toDate().toDateString()}
                            </TableCell>
                            <TableCell align="left"></TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default AdminDashboard;

const StockProducts = ({products}) => {
  return (
    <div className="modal">
      <h1>The following products need to be restocked</h1>
    {products.map((item)=>(
      <div>
        <h2>
          {`${item.name}(${item.quantity})`}
        </h2>
      </div>
    ))}
    </div>
  );
};
