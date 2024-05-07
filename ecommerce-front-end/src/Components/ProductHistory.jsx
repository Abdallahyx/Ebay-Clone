import "../Components/ProductHistory.css";
import { useEffect } from "react";

import { useState } from "react";
function ProductHistory() {

  const [orderHistory, setOrderHistory] = useState([])
  const displayOrderHistory = async () => {
    let currentPage = 1;
    let allResults = [];

    // Fetch data for each page until there are no more pages
    while (true) {
      const response = await fetch(
        `http://127.0.0.1:8000/orders/history/?page=${currentPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        // If no more results, break out of loop
        break;
      }

      const data = await response.json();
      console.log(data)

    

      allResults = allResults.concat(data.results);
      currentPage++; // Move to next page
    }

    // Set the state with all fetched data
    setOrderHistory(allResults);
  };
  useEffect(() => {displayOrderHistory()},[])
  const renderOrderHistory=()=>{
    return orderHistory.map((order)=>{
      return(
        <div className="productdetails">
          <div className="detail">
            <img src={"Images/" +
                    order.product.photo.substring(order.product.photo.lastIndexOf("/") + 1)} alt="product" />
          </div>
          <p className="detail">{order.product.title+" "+order.size}</p>
          <p className="detail">{order.total_price}</p>
          <p className="detail">{order.quantity}</p>
        </div>
      )
    })
  }
  return (
    <div className="justifywrapper">
      <h1>Order History</h1>
      <div className="HistoryWrapper">
        <div className="producttitles">
          <h3>Item Image</h3>
          <h3>Item Name</h3>
          <h3>Total Price</h3>
          <h3>Quantity</h3>
        </div>
        {/* The following divs are placeholders for the product details. */}
        {renderOrderHistory()}
      </div>
    </div>
  );
}
export default ProductHistory;
