import React, { useEffect, useState } from "react";
import "./Item.css";
import img1 from "../SVGs/hmgoepprod_90104284-e151-482d-8d2e-1ce07f68e2f5.webp";
import img2 from "../SVGs/hmgoepprod3.webp"; // Import additional images here

function Item(props) {
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Index of the current image
  const [selectedSize, setSelectedSize] = useState("default"); // State to hold selected size
  const [item, setItem] = useState({}); // State to hold item data
  const imageList = [img1, img2]; // Array of image sources

  const getProduct = async () => {
 
    const response = await fetch(`http://127.0.0.1:8000/products/product/${props.slug}/`);
    const data = await response.json();
    console.log(data);
    const fullproduct = {
      'title': data.title,
      'price': data.price,
      'description': data.description,
      'product_image': [data.photo, img2],
      'variations': data.variations,
      'slug': data.slug,
      'discount': data.price_with_discount,
      'category': data.category,
    };
    setItem(fullproduct);
    setCurrentImageIndex(0);
  };
  const addToCartHandler = async() => { 
    const response = await fetch(selectedSize===""?`http://127.0.0.1:8000/cart/add/${item.slug}/%20/`:
    `http://127.0.0.1:8000/cart/add/${item.slug}/${selectedSize}/`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${localStorage.getItem("token")}`
    },
  })
  const data = await response.json();
  }

  useEffect(() => {
    getProduct();
  }, []);

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
        <h1>{item.title}</h1>
        <p className="price">
          <span className="discounted-price">${item.discount}</span>
          <span className="original-price">${item.price}</span>
          {100*(item.price-item.discount)/item.price === 0?null:<span className="discount">{parseInt(100*(item.price-item.discount)/item.price)}% OFF</span>}
          
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
    {item.variations &&
      item.variations.map((variation, index) => (
        <button 
          key={index}
          className={selectedSize === variation.size ? "selected" : ""}
          onClick={() => handleSizeSelect(variation.size)}
          disabled={variation.quantity_in_stock === 0}
        >
          {variation.size}
        </button>
      ))}
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
          <button onClick={addToCartHandler} className="buttonbasic">
            Add to cart - ${quantity * item.discount}
          </button>
          <button className="buttonbasic">Buy with PayPal</button>
          <br />
          <a href="/123" className="more-options">
            More payment options
          </a>
        </div>
      </div>
      <div className="product-image">
        {item.product_image && (
          <img
            src={"/Images/" + item.product_image[0].substring(item.product_image[0].lastIndexOf("/") + 1)}
            alt="Cotton Twill Cap"
          />
        )}
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
        {item.product_image &&
          item.product_image.map((image, index) => (
            <img
              key={index}
              src={"/Images/" + item.product_image[0].substring(item.product_image[0].lastIndexOf("/") + 1)}
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
