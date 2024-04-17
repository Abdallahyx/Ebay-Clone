import "./Product.css";
function Product(product) {
  const combinedClassName = product.className
    ? `Productitem ${product.className}`
    : "Productitem";
  return (
    <div className={combinedClassName}>
      <div className="Image">
        <img src={product.image} alt={product.name} />
        <div className="overlay"> </div>
      </div>
      <h3>{product.name}</h3>
      <div className="Price">
        <p>
          <s>$30.00</s> From {product.price}.00
        </p>
      </div>
    </div>
  );
}
export default Product;
