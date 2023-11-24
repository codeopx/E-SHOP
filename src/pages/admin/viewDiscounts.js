import SideBar from "../../components/sidebar";
import "../../styles/pages/admin/adminOrders.css";
import { useState, useEffect } from "react";
import { collection, query, doc, getDocs ,deleteDoc} from "firebase/firestore";
import { db } from "../../firebase";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Popconfirm, message } from "antd";
import { AiOutlineDelete,AiOutlineEdit } from "react-icons/ai";
import { Stack } from "@mui/material";

const ViewDiscounts = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getCoupons = async () => {
    const productRef = collection(db, "discounts");
    const featuredQuery = query(productRef);
    const querySnapshots = await getDocs(featuredQuery);
    let coupons = [];
    querySnapshots.forEach((doc) => {
      coupons.push({ id: doc.id, ...doc.data() });
    });
    setCoupons(coupons);
  };
  useEffect(() => {
    getCoupons();
    return () => {
      getCoupons();
    };
  }, [coupons]);
  
  const _delete = async (id) => {
    try {
      await deleteDoc(doc(db, "discounts", id));
      getCoupons()
      messageApi.open({
        type: "success",
        content: "Product deleted succesfully",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };
  return (
    <div className="adminOrders-screen">
      <SideBar />
      {contextHolder}
      <div className="adminOrders-container">
        <div className="adminOrders-details">
          <h1>View all Coupons and Discounts</h1>
          <h2>View and track all Coupons and Discounts on your site</h2>
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
                    Code
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Discount ID
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Percentage Off
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ minWidth: "100px", fontFamily: "Raleway" }}
                  >
                    Delete Code
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {coupons
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.orderID}
                      >
                        <TableCell align="left">{row.code}</TableCell>
                        <TableCell align="left">{row.discountID}</TableCell>
                        <TableCell align="left">{row.percentage}</TableCell>
                        <TableCell align="left">
                          <Stack spacing={2} direction="row">
                            <AiOutlineEdit
                              // onClick={() =>
                              //   navigate(`/edit-products/${row.productID}`)
                              // }
                              style={{
                                fontSize: "20px",
                                color: "#ffff",
                              }}
                            />
                            <Popconfirm
                              title="Delete this code"
                              description={"Delete " + row.code + " ?"}
                              onConfirm={() => _delete(row.discountID)}
                              //   onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <AiOutlineDelete
                                style={{
                                  fontSize: "20px",
                                  color: "#2f234f",
                                  cursor: "pointer",
                                }}
                              />
                            </Popconfirm>
                          </Stack>
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

export default ViewDiscounts;
