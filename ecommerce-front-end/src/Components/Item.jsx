import "./Item.css";
import img1 from "../SVGs/hmgoepprod_90104284-e151-482d-8d2e-1ce07f68e2f5.webp";

function Item() {
  return (
    <div class="product-container">
      <div class="product-image">
        <img src={img1} alt="Cotton Twill Cap" />
        <div class="image-nav">
          <span class="prev">&lt;</span>
          <span class="next">&gt;</span>
        </div>
      </div>
      <div class="product-details">
        <h1>Cotton Twill Cap</h1>
        <p class="price">
          <span class="discounted-price">$28.00</span>
          <span class="original-price">$35.00</span>
          <span class="discount">20% OFF</span>
        </p>
        <p class="viewers">36 People are viewing this right now</p>
        <div class="color-option">
          <span>Color: Black</span>
          <div class="color-choice">
            <div class="black selected"></div>
            <div class="white"></div>
          </div>
        </div>
        <div class="quantity">
          <span>Quantity</span>
          <div class="qty-control">
            <button class="minus">-</button>
            <input type="text" value="1" />
            <button class="plus">+</button>
          </div>
        </div>
        <div class="actions">
          <button class="add-to-cart">Add to cart - $28.00</button>
          <button class="buy-paypal">Buy with PayPal</button>
          <a href="/123" class="more-options">
            More payment options
          </a>
        </div>
      </div>
    </div>
  );
}
export default Item;
