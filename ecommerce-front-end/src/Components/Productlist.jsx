import Product from "./Product";
import "./Productlist.css";
function Productlist({ products }) {
  return (
    <div className="productlist">
      {products.map((product) => (
        <Product {...product} />
      ))}
    </div>
  );
}

export default Productlist;