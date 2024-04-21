import "./Product.css";
import cart from "../SVGs/cart.svg";
import heart from "../SVGs/heart.svg";
import hearthover from "../SVGs/heartwhite.svg";
import carthover from "../SVGs/cartwhite.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Product(product) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  let clicked = false;
  const addCartHandler = () => {
    clicked = true;
    product.onAddCartClick(clicked);
  };
  const [hovercart, sethovercart] = useState(false);
  const handleMouseEnterCart = () => {
    sethovercart(true);
  };
  const handleMouseLeaveCart = () => {
    sethovercart(false);
  };

  const [hoverh, sethoverh] = useState(false);
  const handleMouseEnterHeart = () => {
    sethoverh(true);
  };
  const handleMouseLeaveHeart = () => {
    sethoverh(false);
  };

  const productID = 123;

  const handleImageClick = () => {
    // Navigate to the product page when the image is clicked
    navigate(`/product/${productID}`);
  };

  const combinedClassName = product.className
    ? `Productitem ${product.className}`
    : "Productitem";
  return (
    <div className={combinedClassName}>
      <div className="Image" onClick={handleImageClick}>
        {" "}
        {/* Attach click handler to the whole image container */}
        <img src={product.image} alt={product.name} />
        <div className="overlay">
          <div
            onMouseEnter={handleMouseEnterCart}
            onMouseLeave={handleMouseLeaveCart}
            className="image1"
          >
            <img
              onClick={addCartHandler}
              src={hovercart ? carthover : cart}
              alt="add to cart"
            />
          </div>
          <div
            onMouseEnter={handleMouseEnterHeart}
            onMouseLeave={handleMouseLeaveHeart}
            className="image2"
          >
            <img src={hoverh ? hearthover : heart} alt="add to wishlist" />
          </div>
        </div>
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
