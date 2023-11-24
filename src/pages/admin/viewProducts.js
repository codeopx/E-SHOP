import "../../styles/pages/admin/adminViewProducts.css";
import PuffLoader from "react-spinners/PuffLoader";
import SideBar from "../../components/sidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect } from "react";
import { collection, query, doc, getDocs, deleteDoc } from "firebase/firestore";
import { AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import { db } from "../../firebase";
import { Button, Avatar, Popconfirm, message } from "antd";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getProducts = async () => {
    const productRef = collection(db, "products");
    const featuredQuery = query(productRef);
    const querySnapshots = await getDocs(featuredQuery);
    let products = [];
    querySnapshots.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    setRows(products);
    setLoading(false);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getProducts();
    }
  };

  const _delete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      getProducts();
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

  useEffect(() => {
    getProducts();
    return () => {
      getProducts();
    };
  }, []);
  if (loading) {
    return (
      <div className="spinner">
        <PuffLoader color={"#2f234f"} loading={loading} size={60} />
      </div>
    );
  }
  return (
    <div className="adminViewP-screen">
      {contextHolder}
      <SideBar />
      <div className="adminViewP-container">
        <div className="adminViewP-details">
          <h1>View all Products</h1>
          <h2>View and manage all products on your site</h2>
        </div>
        <div className="adminViewP-table">
          {rows.length > 0 && (
            <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
              <Box height={10} />
              <Stack direction="row" spacing={2} className="my-2 mb-2">
                <Autocomplete
                  color="#2f234f"
                  style={{ fontFamily: "Raleway" }}
                  disablePortal
                  id="combo-box-demo"
                  options={rows}
                  sx={{ width: 300 }}
                  onChange={(e, v) => filterData(v)}
                  getOptionLabel={(rows) => rows.name || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Search Products"
                      style={{ fontFamily: "Raleway" }}
                    />
                  )}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                ></Typography>
                <Button
                  onClick={() => navigate("/add-products")}
                  type="primary"
                  icon={<AiOutlinePlus />}
                  style={{
                    fontWeight: "500",
                    backgroundColor: "#2f234f",
                    fontFamily: "Raleway",
                  }}
                >
                  Add Product
                </Button>
              </Stack>
              <Box height={10} />
              <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Image
                      </TableCell>
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
                        Price
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Category
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        align="left"
                        style={{ minWidth: "100px", fontFamily: "Raleway" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows
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
                            key={row.productID}
                            style={{ fontFamily: "Raleway" }}
                          >
                            <TableCell align="left">
                              <Avatar size={55} src={row.image} />
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{
                                fontFamily: "Raleway",
                                fontWeight: "500",
                              }}
                            >
                              {row.name}
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{
                                fontFamily: "Raleway",
                                fontWeight: "500",
                              }}
                            >
                              {"₦" + row.price.toLocaleString()}
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{
                                fontFamily: "Raleway",
                                fontWeight: "500",
                              }}
                            >
                              {row.category}
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{
                                fontFamily: "Raleway",
                                fontWeight: "500",
                              }}
                            >
                              {row.quantity}
                            </TableCell>
                            <TableCell
                              align="left"
                              style={{
                                fontFamily: "Raleway",
                                fontWeight: "500",
                              }}
                            >
                              <Stack spacing={2} direction="row">
                                <AiOutlineEdit
                                onClick={() => navigate(`/edit-products/${row.productID}`)}
                                  style={{
                                    fontSize: "20px",
                                    color: "#2f234f",
                                    cursor: "pointer",
                                  }}
                                />
                                <Popconfirm
                                  title="Delete this product"
                                  description={"Delete " + row.name + " ?"}
                                  onConfirm={() => _delete(row.productID)}
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;
