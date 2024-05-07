import "./Checkout.css";
import paypal from "../SVGs/paypal.svg";
function Checkout(props)
{

    return(
        // HTML (JSX)
<form>
  <div className="paypal-button">
   <img src={paypal} alt="paypal" />

  </div>
  <div className="contact-section">
    <h3>Contact</h3>
    <input type="email" placeholder="Email or mobile phone number" />
    <input type="text" placeholder="Email for order notes and offers" />
  </div>
  <div className="delivery-section">
    <h3>Delivery</h3>
    <select>
      <option>Ship</option>
      <option>Pick up</option>
    </select>
    <select>
      <option>United States</option>
      {/* Add more country options /}
    </select>
    <input type="text" placeholder="Post code (optional)" />
    <input type="text" placeholder="Address" />
    <input type="text" placeholder="Apartment, suite, etc. (optional)" />
    <input type="text" placeholder="City" />
    <select>
      <option>State</option>
      {/ Add more state options /}
    </select>
    <input type="text" placeholder="ZIP code" />
    <input type="checkbox" className="save-info" /> Save this information for next time
  </div>
 
  <div className="payment-section">
    <h3>Payment</h3>
    <p>All transactions are secure and encrypted.</p>
    <select>
      <option>Credit card</option>
      {/ Add more payment options */}
    </select>
    <input type="text" placeholder="Card number" />
    <input type="text" placeholder="Expiration date (MM/YY)" />
    <input type="text" placeholder="Security code" />
    <input type="text" placeholder="Name on card" />
  </div>
  <div className="total-section">
  <p className="totalmoney">Total</p>
  <p><s className="usd">USD </s>${props.price}.00</p>
  </div>
  <div className="pay-button">
    <button type="submit">Pay now</button>
  </div>
</form>
    )
}
export default Checkout;