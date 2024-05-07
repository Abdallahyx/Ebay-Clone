import { useState } from "react";
import "./CartProduct.css";

import image1 from "../SVGs/pexels-alex-carollo-592815.jpg";
import image2 from "../SVGs/pexels-jatin-anand-125779.jpg";
import image3 from "../SVGs/hmgoepprod_90104284-e151-482d-8d2e-1ce07f68e2f5.webp";
import image4 from "../SVGs/pexels-jess-bailey-designs-1162519.jpg";
import truck from "../SVGs/truck-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function CartProduct(props) {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  //const[cartphotos, setCartPhotos] = useState([]);
  const navigate = useNavigate();
  const displayCart = async () => {
    const response = await fetch("http://127.0.0.1:8000/cart/", {
      method: "GET",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    await setCartItems(data.items);
    await setTotalPrice(data.total_amount);
    console.log(cartItems);
  };
  useEffect(() => {
    displayCart();
  }, []);
  /* const getPhotos = async()=>{
    const photos =[];
    for(let i = 0; i < cartItems.length; i++)
  {
    const response = await fetch(`http://127.0.0.1:8000/products/${cartItems[i].slug}/`);
    const data = await response.json();
    photos.push(data.photo);
  }
}
useEffect(() => {getPhotos()},[])*/
  const proceedToCheckout = async (e) => {
    e.preventDefault();
    const form = e.target.form;
    const formData = new FormData(form);
    const formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    formObject["activate_balance"] = false;
    formObject["coupon"] = null;
    formObject["comment"] = "";
    const shippinginfo = await fetch(
      "http://127.0.0.1:8000/accounts/profile/",
      {
        method: "GET",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    const profileinfo = await shippinginfo.json();
    console.log(profileinfo.shipping_info);
    formObject["shipping_info"] = profileinfo.shipping_info;
    console.log(formObject);
    console.log("payment method")
    console.log(formObject.payment_method)
    const response = await fetch("http://127.0.0.1:8000/orders/checkout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formObject),
    });
    
    if(response.ok)
      {
        if(formObject.payment_method==2 || formObject.payment_method==1)
          {
            console.log("payment successful")
            navigate("/success")
          }
          else
          {
            const data = await response.json();
            console.log(data);
            window.location.href=data.payment_link

            
          }
        }

      
    
  };
  const truck = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="14"
      viewBox="0 0 21 14"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 0.875C0 0.391751 0.391751 0 0.875 0H13.5625C14.0457 0 14.4375 0.391751 14.4375 0.875V3.0625H17.3125C17.5867 3.0625 17.845 3.19101 18.0104 3.40969L20.8229 7.12844C20.9378 7.2804 21 7.46572 21 7.65625V11.375C21 11.8582 20.6082 12.25 20.125 12.25H17.7881C17.4278 13.2695 16.4554 14 15.3125 14C14.1696 14 13.1972 13.2695 12.8369 12.25H7.72563C7.36527 13.2695 6.39293 14 5.25 14C4.10706 14 3.13473 13.2695 2.77437 12.25H0.875C0.391751 12.25 0 11.8582 0 11.375V0.875ZM2.77437 10.5C3.13473 9.48047 4.10706 8.75 5.25 8.75C6.39293 8.75 7.36527 9.48046 7.72563 10.5H12.6875V1.75H1.75V10.5H2.77437ZM14.4375 8.89937V4.8125H16.8772L19.25 7.94987V10.5H17.7881C17.4278 9.48046 16.4554 8.75 15.3125 8.75C15.0057 8.75 14.7112 8.80264 14.4375 8.89937ZM5.25 10.5C4.76676 10.5 4.375 10.8918 4.375 11.375C4.375 11.8582 4.76676 12.25 5.25 12.25C5.73323 12.25 6.125 11.8582 6.125 11.375C6.125 10.8918 5.73323 10.5 5.25 10.5ZM15.3125 10.5C14.8293 10.5 14.4375 10.8918 14.4375 11.375C14.4375 11.8582 14.8293 12.25 15.3125 12.25C15.7957 12.25 16.1875 11.8582 16.1875 11.375C16.1875 10.8918 15.7957 10.5 15.3125 10.5Z"
      ></path>
    </svg>
  );
  const images = [image1, image2, image3, image4];
  const [productQuantities, setProductQuantities] = useState([1, 1, 1, 1]); // Initialize quantities for each product to 1
  const productPrice = 38.0;

  // Function to handle addition of quantity for a specific product
  const handleAdd = async (slug, size) => {
    const response2 = await fetch(
      `http://127.0.0.1:8000/cart/add_quantity/${slug}/${size}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    const data2 = await response2.json();
    displayCart();
  };

  // Function to handle subtraction of quantity for a specific product
  const handleSubtract = async (slug, size) => {
    const response2 = await fetch(
      `http://127.0.0.1:8000/cart/minus_quantity/${slug}/${size}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    displayCart();
  };

  // Function to calculate subtotal
  const calculateSubtotal = () => {
    let subtotal = 0;
    for (let i = 0; i < productQuantities.length; i++) {
      subtotal += productPrice * productQuantities[i];
    }
    return subtotal;
  };

  let cart = cartItems.map((item, i) => {
    return (
      <div className="productcontents" key={i}>
        <div className="content">
          <div className="imagedetails">
            <div className="productname">
              <p>
                ${item.product_name + " " + item.product_variation_details.size}
              </p>
              <h5>Remove</h5>
            </div>
          </div>
        </div>

        <div className="productdetails">
          <p>${item ? item.total_price / item.quantity : "Loading"}</p>
          <div className="quantityyy">
            <button
              onClick={() =>
                handleSubtract(
                  item.product_slug,
                  item.product_variation_details.size
                )
              }
            >
              -
            </button>

            <p>{item ? item.quantity : "Loading"}</p>

            <button
              onClick={() =>
                handleAdd(
                  item.product_slug,
                  item.product_variation_details.size
                )
              }
            >
              +
            </button>
          </div>
          <div className="total">
            <p>${item ? item.total_price : "Loading"}</p>
          </div>
        </div>
      </div>
    );
  });
  const renderProduct = () => {
    return cart;
  };
  const handleClearCart = async () => {
    const response = await fetch("http://127.0.0.1:8000/cart/clear/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log(data);
    displayCart();
  };

  props.passPrice(calculateSubtotal());
  console.log();
  return (
    <div className="cartPage">
      <div className="cartTitle">
        <h2> Shopping Cart</h2>
      </div>
      <div className="pagecontent">
        <div className="product">
          <div className="producttitles">
            <h3>Product</h3>
            <div className="righttitles">
              <h3>Price</h3>
              <h3>Quantity</h3>
              <h3>Total</h3>
            </div>
          </div>

          {renderProduct()}
          <div className="clearCart">
            <button onClick={handleClearCart} className="buttonbasic">
              Clear Cart
            </button>
          </div>
        </div>

        <form className="checkout">
          <div className="truck">{truck}</div>
          <p>
            Buy <s>$75.00 </s>more to enjoy Free Shipping
          </p>
          <p>
            Do you want a gift wrap? Only <s>$5.00</s>
          </p>
          <div className="subtotal">
            <h3>Subtotal</h3>
            <h3>${totalPrice}</h3>
          </div>
          <p>Taxes and shipping calculated at checkout</p>
          <div className="Paymentmethod">
            <p>Choose Your Payment Method</p>
            <select name="payment_method">
              <option value={3}>Paypal</option>
              <option value={2}>Balance</option>
              <option value={1}>Cash</option>
            </select>
          </div>
          <div className="discount">
            <input type="text" placeholder="Discount code" />
            <button>Apply</button>
          </div>
          <div className="checkoutt">
            <button type="submit" onClick={proceedToCheckout}>
              Proceed to checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CartProduct;
