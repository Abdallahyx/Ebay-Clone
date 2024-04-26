import React, { useState } from "react";
import "./Item.css";
import img1 from "../SVGs/hmgoepprod_90104284-e151-482d-8d2e-1ce07f68e2f5.webp";
import img2 from "../SVGs/hmgoepprod3.webp"; // Import additional images here

function Item() {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index of the current image
  const [selectedSize, setSelectedSize] = useState(""); // State to hold selected size
  const imageList = [img1, img2]; // Array of image sources

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? imageList.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  return (
    <div className="product-container">
      <div className="product-details">
        <h1>Cotton Twill Cap</h1>
        <p className="price">
          <span className="discounted-price">$28.00</span>
          <span className="original-price">$35.00</span>
          <span className="discount">20% OFF</span>
        </p>
        <div className="color-option">
          <span>Color</span>
          <div className="color-choice">
            <div className="black" />
            <div className="white" />
          </div>
        </div>
        <div className="size-option">
          <span>Size</span>
          <div className="size-choice">
            <button
              className={selectedSize === "XS" ? "selected" : ""}
              onClick={() => handleSizeSelect("XS")}
            >
              XS
            </button>
            <button
              className={selectedSize === "S" ? "selected" : ""}
              onClick={() => handleSizeSelect("S")}
            >
              S
            </button>
            <button
              className={selectedSize === "M" ? "selected" : ""}
              onClick={() => handleSizeSelect("M")}
            >
              M
            </button>
            <button
              className={selectedSize === "L" ? "selected" : ""}
              onClick={() => handleSizeSelect("L")}
            >
              L
            </button>
            <button
              className={selectedSize === "XL" ? "selected" : ""}
              onClick={() => handleSizeSelect("XL")}
            >
              XL
            </button>
          </div>
        </div>
        <div className="quantity">
          <span>Quantity</span>
          <div className="qty-control">
            <button className="minus" onClick={decreaseQuantity}>
              -
            </button>
            <input type="text" value={quantity} readOnly />
            <button className="plus" onClick={increaseQuantity}>
              +
            </button>
          </div>
        </div>
        <div className="actions">
          <button className="add-to-cart">
            Add to cart - ${quantity * 28.0}
          </button>
          <button className="buy-paypal">Buy with PayPal</button>
          <br></br>
          <a href="/123" className="more-options">
            More payment options
          </a>
        </div>
      </div>
      <div className="product-image">
        <img src={imageList[currentImageIndex]} alt="Cotton Twill Cap" />
        <div className="image-nav">
          <span className="prev" onClick={prevImage}>
            &lt;
          </span>
          <span className="next" onClick={nextImage}>
            &gt;
          </span>
        </div>
      </div>
      <div className="image-bar">
        {imageList.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1}`}
            onClick={() => selectImage(index)}
            className={index === currentImageIndex ? "selected" : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default Item;