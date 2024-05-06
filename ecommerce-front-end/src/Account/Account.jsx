import "./Account.css";
import payment from "../SVGs/payment.svg";
import paymenthover from "../SVGs/paymenthover.svg";
import logout from "../SVGs/logout.svg";
import logouthover from "../SVGs/logouthover.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

/*handle on click events*/

function Account() {

  const [Loading,setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [info, setInfo] = useState({});
  const [username, setUsername] = useState("");
  const [paymentmode, setPaymentmode] = useState(false);
  const displayAccountInfo = async () => {
    const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
    const data = await response.json();
    setInfo(data);
    setUsername(data.username.slice(1));
    console.log(info);
    setLoading(false);

  }
  useEffect(() => {displayAccountInfo()}, []);


  
  //

  const navigate = useNavigate();
  const [hoverpayment, sethoverpayment] = useState(false);
  const [hoverlogout, sethoverlogout] = useState(false);
  const handleLogout = async () => {
   
      const response = await fetch("http://127.0.0.1:8000/accounts/logout/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/login");
      } 

  };

  const handleMouseEnterpayment = () => {
    sethoverpayment(true);
  };
  const handleMouseLeavepayment = () => {
    sethoverpayment(false);
  };

  const handleMouseEnterlogout = () => {
    sethoverlogout(true);
  };
  const handleMouseLeavelogout = () => {
    sethoverlogout(false);
  };
  const handlePaymentClick = () => {
    setPaymentmode(!paymentmode);
  }
  const addBalanceHandler = async (e) => {
    e.preventDefault();
    const form = e.target.form;
    const formData = new FormData(form);
    const formObject = {};
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }
    const response = await fetch("http://127.0.0.1:8000/payments/user/add-balance/",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      }
      
    )
    const data = await response.json();
    window.location.href=data.payment_url
    
  }

  return (
    <div className="container">
      <div className="title">
        <p>Account</p>
      </div>

      <div className="components">
        <div className="options">
         
          
          <div
            onMouseEnter={handleMouseEnterpayment}
            onMouseLeave={handleMouseLeavepayment}
            className="payment item"
            onClick={handlePaymentClick}
          >
            <img src={hoverpayment ? paymenthover : payment} alt="payment" />
            <p>Payment</p>
          </div>
          <div
            onMouseEnter={handleMouseEnterlogout}
            onMouseLeave={handleMouseLeavelogout}
            onClick={handleLogout}
            className="logout item"
          >
            <img src={hoverlogout ? logouthover : logout} alt="logout" />
            <p>Logout</p>
          </div>
        </div>
        <div className="mainmenu">
          <p className="firstname">
            Hello <user>{Loading?"Loading":username}</user>
          </p>
          <div className="details">
            {paymentmode===true?
            <>
            <h3>Add Balance</h3>
            <form className="removeall">
            <input name="value" type="number" placeholder="Enter amount"></input>
            <button onClick={addBalanceHandler} className="buttonbasic">Confirm</button>
            </form>
            <a href="/transactionhistorycustomer">
              <h3>Transaction History</h3>
            </a>
            </>
            :(<><h3>Account details</h3>
            <div className="name menuitem">
              <h4>Name</h4>
              <p className="text">{Loading?"Loading":info?info.first_name+" "+info.surname: "loading"}</p> {/* Add the user's name here */}
            </div>
            <div className="balance menuitem">
              {/* Add the user's balance here */}
              <h4>Balance</h4>
              <p className="text">{Loading?"Loading":info.balance}</p>
              {/* Add the user's address here */}
            </div>
            <div className="email menuitem">
              <h4>Email</h4>
              <p className="text">{Loading?"Loading":info.email}</p>{" "}
              {/* Add the user's email here */}
            </div>
            <div className="address menuitem">
              <h4>Phone Number</h4>
              <p className="text">{Loading?"Loading":info.phone_number}</p>
              {/* Add the user's address here */}
            </div>
            <div className="address menuitem">
              <h4>Address</h4>
              <p className="text">{Loading?"Loading":info.shipping_info.address+','+info.shipping_info.city+','+info.shipping_info.country}</p>
              {/* Add the user's address here */}
            </div>
            <div className="linkss">
            <a href="/orderhistory">
              <h3>Order History</h3>
            </a>
            <a href="/paymenthistory">
              <h3>Payment History</h3>
            </a>
            </div></>)}
            
            {/*instead of # add the link to the order history page*/}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
