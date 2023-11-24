import SideBar from "../../components/sidebar";
import "../../styles/pages/admin/adminOrders.css";
import { useState, useEffect } from "react";
import {
  collection,
  query,
  doc,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Space, Select, message, Rate } from "antd";

const ViewRiders = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [riders, setRiders] = useState([]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getRiders = async () => {
    const productRef = collection(db, "users");
    const featuredQuery = query(productRef, where("driver", "==", true));
    const querySnapshots = await getDocs(featuredQuery);
    let riders = [];
    querySnapshots.forEach((doc) => {
      riders.push({ id: doc.id, ...doc.data() });
    });
    setRiders(riders);
  };
  useEffect(() => {
    getRiders();
    return () => {
      getRiders();
    };
  }, [riders]);

  return (
    <div className="adminOrders-screen">
      <SideBar />
      {contextHolder}
      <div className="adminOrders-container">
        <div className="adminOrders-details">
          <h1>View all Riders</h1>
          <h2>View all Riders on your site</h2>
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
                    Name
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Number
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Online?
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    In a Job?
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Rating
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.orderID}
                      >
                        <TableCell align="left">{row.name}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.phone}</TableCell>
                        <TableCell align="left">{row.number}</TableCell>
                        <TableCell align="left">
                          {row.online === true ? "yes" : "no"}
                        </TableCell>
                        <TableCell align="left">
                          {row.picked === true ? "In a Job" : "Currently Free"}
                        </TableCell>
                        <TableCell align="left">
                          <Rate
                            disabled
                            allowHalf
                            value={
                              row.rating.length > 0
                                ? row.rating.reduce((a, b) => a + b, 0) /
                                  row.rating.length
                                : 0
                            }
                            style={{ fontSize: 13 }}
                          />
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

export default ViewRiders;
