import "../Components/ProductHistory.css";
import image from "../SVGs/pexels-alex-carollo-592815.jpg";
import image2 from "../SVGs/pexels-jatin-anand-125779.jpg";
function ProductHistory() {
  return (
    <div className="justifywrapper">
      <h1>Order History</h1>
      <div className="HistoryWrapper">
        <div className="producttitles">
          <h3>Item Image</h3>
          <h3>Item Name</h3>
          <h3>Item Price</h3>
          <h3>Transaction Date</h3>
          <h3>Quantity</h3>
        </div>
        {/* The following divs are placeholders for the product details. */}
        <div className="productdetails">
          <div className="detail">
            <img src={image} alt="product" />
          </div>
          <p className="detail">Product 1</p>
          <p className="detail">$20.00</p>
          <p className="detail">12/12/2021</p>
          <p className="detail">1</p>
        </div>
        <div className="productdetails">
          <div className="detail">
            <img src={image2} alt="product" />
          </div>
          <p className="detail">Product 1</p>
          <p className="detail">$20.00</p>
          <p className="detail">12/12/2021</p>
          <p className="detail">1</p>
        </div>
        <div className="productdetails">
          <div className="detail">
            <img src={image2} alt="product" />
          </div>
          <p className="detail">Product 1</p>
          <p className="detail">$20.00</p>
          <p className="detail">12/12/2021</p>
          <p className="detail">1</p>
        </div>
        <div className="productdetails">
          <div className="detail">
            <img src={image2} alt="product" />
          </div>
          <p className="detail">Product 1</p>
          <p className="detail">$20.00</p>
          <p className="detail">12/12/2021</p>
          <p className="detail">1</p>
        </div>
        <div className="productdetails">
          <div className="detail">
            <img src={image2} alt="product" />
          </div>
          <p className="detail">Product 1</p>
          <p className="detail">$20.00</p>
          <p className="detail">12/12/2021</p>
          <p className="detail">1</p>
        </div>
        <div className="productdetails">
          <div className="detail">
            <img src={image2} alt="product" />
          </div>
          <p className="detail">Product 1</p>
          <p className="detail">$20.00</p>
          <p className="detail">12/12/2021</p>
          <p className="detail">1</p>
        </div>
      </div>
    </div>
  );
}
export default ProductHistory;
