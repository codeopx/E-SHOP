import SideBar from "../../components/sidebar";
import "../../styles/pages/admin/adminOrders.css";
import { useState, useEffect } from "react";
import { collection, query, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Space, Select, message } from "antd";

const AdminOrders = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const editOrder = async (id) => {
    await updateDoc(doc(db, "order", id), {
      status: status,
    });
    messageApi.open({
      type: "success",
      content: "Order updated succesfully",
    });
  };
  const getOrders = async () => {
    const productRef = collection(db, "order");
    const featuredQuery = query(productRef);
    const querySnapshots = await getDocs(featuredQuery);
    let products = [];
    querySnapshots.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    setOrders(products);
  };
  useEffect(() => {
    getOrders();
    return () => {
      getOrders();
    };
  }, [orders]);
  return (
    <div className="adminOrders-screen">
      <SideBar />
      {contextHolder}
      <div className="adminOrders-container">
        <div className="adminOrders-details">
          <h1>View all Orders</h1>
          <h2>View and track all Orders on your site</h2>
        </div>
        <div className="adminOrders-table">
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
                    Rider Name
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Rider Phone
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Rider Number
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
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Edit Order
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.orderID}
                      >
                        <Button style={{ marginTop: "10px" }}>
                          View Item(s)
                        </Button>
                        <TableCell align="left">{row.orderID}</TableCell>
                        <TableCell align="left">
                          {"₦" + row.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="left">{row.rider_name}</TableCell>
                        <TableCell align="left">{row.rider_number}</TableCell>
                        <TableCell align="left">{row.rider_phone}</TableCell>
                        <TableCell align="left">{row.status}</TableCell>
                        <TableCell align="left">
                          {row.orderDate.toDate().toDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Space>
                            <Select
                              defaultValue={row.status}
                              onChange={(value) => {
                                setStatus(value);
                              }}
                              style={{ fontSize: "90px" }}
                            >
                              <Select.Option value="processing">
                                <span style={{ fontWeight: "600" }}>
                                  processing
                                </span>
                              </Select.Option>
                              <Select.Option value="transit">
                                <span style={{ fontWeight: "600" }}>
                                  transit
                                </span>
                              </Select.Option>
                              <Select.Option value="completed">
                                <span style={{ fontWeight: "600" }}>
                                  completed
                                </span>
                              </Select.Option>
                            </Select>
                            <Button
                              style={{
                                fontWeight: "600",
                                backgroundColor: "#2f234f",
                              }}
                              type="primary"
                              htmlType="submit"
                              onClick={() => editOrder(row.orderID)}
                            >
                              Edit
                            </Button>
                          </Space>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
