import "./Account.css";
import payment from "../SVGs/payment.svg";
import address from "../SVGs/address.svg";
import dashboard from "../SVGs/dashboard.svg";
import paymenthover from "../SVGs/paymenthover.svg";
import addresshover from "../SVGs/addresshover.svg";
import dashboardhover from "../SVGs/dashboardhover.svg";
import logout from "../SVGs/logout.svg";
import logouthover from "../SVGs/logouthover.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*handle on click events*/

function Account() {
  const navigate = useNavigate();
  const [hoverdash, sethoverdash] = useState(false);
  const [hoverpayment, sethoverpayment] = useState(false);
  const [hoveraddress, sethoveraddress] = useState(false);
  const [hoverlogout, sethoverlogout] = useState(false);
  const handleLogout = () => {
    navigate("/login");
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
            Hello <user>Ahmed</user>
          </p>{" "}
          {/* Add the user's name here instead of Ahmed*/}
          <div className="details">
            <h3>Account details</h3>
            <div className="name menuitem">
              <h4>Name</h4>
              <p className="text">Ahmed</p> {/* Add the user's name here */}
            </div>
            <div className="balance menuitem">
              {/* Add the user's balance here */}
              <h4>Balance</h4>
              <p className="text">5000$</p>
              {/* Add the user's address here */}
            </div>
            <div className="email menuitem">
              <h4>Email</h4>
              <p className="text">asdd@yahoo.com</p>{" "}
              {/* Add the user's email here */}
            </div>
            <div className="address menuitem">
              <h4>Address1</h4>
              <p className="text">123, ABC street, XYZ city</p>
              {/* Add the user's address here */}
            </div>
            <div className="address menuitem">
              <h4>Address2</h4>
              <p className="text">123, ABC street, XYZ city</p>
              {/* Add the user's address here */}
            </div>
            <a href="#"><h3>Order History</h3></a>{/*instead of # add the link to the order history page*/}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Account;
