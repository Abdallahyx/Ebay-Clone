import { useState } from "react"; // Import useState hook
import "../Components/Inventory.css";
import image from "../SVGs/pexels-alex-carollo-592815.jpg";
import image2 from "../SVGs/pexels-jatin-anand-125779.jpg";

function Inventory() {
  // Define state for remaining quantity
  const [remainingQuantity, setRemainingQuantity] = useState([50, 6, 80, 60]);

  // Function to handle incrementing remaining quantity
  const handleIncrement = (index) => {
    const newQuantity = [...remainingQuantity];
    newQuantity[index]++;
    setRemainingQuantity(newQuantity);
  };

  // Function to handle decrementing remaining quantity
  const handleDecrement = (index) => {
    const newQuantity = [...remainingQuantity];
    if (newQuantity[index] > 0) {
      newQuantity[index]--;
      setRemainingQuantity(newQuantity);
    }
  };

  return (
    <div className="justifywrapper">
      <h1>Inventory</h1>
      <div className="HistoryWrapper">
        <div className="producttitles">
          <h3>Item Image</h3>
          <h3>Item Name</h3>
          <h3>Item Price</h3>
          <h3>Sold</h3>
          <h3>Remaining</h3>
          <h3>Modify Remaining</h3>
        </div>
        {/* The following divs are placeholders for the product details. */}
        {remainingQuantity.map((quantity, index) => (
          <div className="productdetails" key={index}>
            <div className="detail">
              <img src={index % 2 === 0 ? image : image2} alt="product" />
            </div>
            <p className="detail">Product {index + 1}</p>
            <p className="detail">$20.00</p>
            <p className="detail sold">Sold Quantity</p>
            {quantity === 0 ? (
              <p className="detail remaining">Sold out!</p>
            ) : (
              <p className="detail remaining">{quantity}</p>
            )}
            <div className="detail">
              <button
                className="incrementButton"
                onClick={() => handleIncrement(index)}
              >
                +
              </button>
              <button
                className="decrementButton"
                onClick={() => handleDecrement(index)}
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inventory;
