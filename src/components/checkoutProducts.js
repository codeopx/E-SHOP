import "../styles/components/checkoutProducts.css";

const CheckoutProducts = ({ products }) => {
  return (
    <>
      {products.map((item) => (
        <div className="check-Row">
          <h1>{item.name}</h1>
          <h2>{"×"+item.quantity}</h2>
        </div>
      ))}
    </>
  );
};

export default CheckoutProducts;
