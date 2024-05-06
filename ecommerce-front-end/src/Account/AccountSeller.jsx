import "./AccountSeller.css";
import address from "../SVGs/address.svg";
import addresshover from "../SVGs/addresshover.svg";
import dashboard from "../SVGs/dashboard.svg";
import dashboardhover from "../SVGs/dashboardhover.svg";
import payment from "../SVGs/payment.svg";
import paymenthover from "../SVGs/paymenthover.svg";
import logout from "../SVGs/logout.svg";
import logouthover from "../SVGs/logouthover.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 

function AccountSeller() {
  const [Loading,setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [info, setInfo] = useState({});
  const [username, setUsername] = useState("");
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


  const navigate = useNavigate();
  const [hoverdash, sethoverdash] = useState(false);
  const [hoverpayment, sethoverpayment] = useState(false);
  const [hoveraddress, sethoveraddress] = useState(false);
  const [hoverlogout, sethoverlogout] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/logout/", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        console.log("success");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMouseEnterdash = () => {
    sethoverdash(true);
    console.log("hovered");
  };
  const handleMouseLeavedash = () => {
    sethoverdash(false);
  };
  const handleMouseEnterpayment = () => {
    sethoverpayment(true);
  };
  const handleMouseLeavepayment = () => {
    sethoverpayment(false);
  };
  const handleMouseEnteraddress = () => {
    sethoveraddress(true);
  };
  const handleMouseLeaveaddress = () => {
    sethoveraddress(false);
  };
  const handleMouseEnterlogout = () => {
    sethoverlogout(true);
  };
  const handleMouseLeavelogout = () => {
    sethoverlogout(false);
  };

  return (
    <div className="container">
      <div className="title">
        <p>Account</p>
      </div>

      <div className="components">
        <div className="options">
          <div
            onMouseEnter={handleMouseEnterdash}
            onMouseLeave={handleMouseLeavedash}
            className="dashboard item"
          >
            <img src={hoverdash ? dashboardhover : dashboard} alt="dashboard" />
            <p>Dashboard</p>
          </div>
          <div
            onMouseEnter={handleMouseEnteraddress}
            onMouseLeave={handleMouseLeaveaddress}
            className="address item"
          >
            <img src={hoveraddress ? addresshover : address} alt="address" />
            <p>Address</p>
          </div>
          <div
            onMouseEnter={handleMouseEnterpayment}
            onMouseLeave={handleMouseLeavepayment}
            className="payment item"
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
          </p>{" "}
          {/* Add the user's name here instead of Ahmed*/}
          <div className="details">
            <h3>Seller details</h3>
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
            <h3>Store details</h3>
            <div className="menuitem">
              <h4>Store Name</h4>
              <p className="text">SHOPIFY</p>
              {/* Add the seller's store address */}
            </div>
            <div className="menuitem">
              <h4>Store Address</h4>
              <p className="text">123, ABC street, XYZ city</p>
              {/* Add the seller's store address */}
            </div>
            <div className="menuitem">
              <h4>Store City</h4>
              <p className="text">123, ABC street, XYZ city</p>
              {/* Add the seller's store address */}
            </div>
            <div className="menuitem">
              <h4>Store Country</h4>
              <p className="text">123, ABC street, XYZ city</p>
              {/* Add the seller's store address */}
            </div>
            <div className="linkss">
            <a href="/inventory">
              <h3>Go to Inventory</h3>
            </a>
            <a href="/transactionhistoryseller">
              <h3>TransactionHistory</h3>
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AccountSeller;
