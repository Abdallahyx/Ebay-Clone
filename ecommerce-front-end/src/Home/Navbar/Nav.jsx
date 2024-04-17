import contact from "../../SVGs/contact.svg";
import contacthover from "../../SVGs/contacthover.svg";
import heart from "../../SVGs/heart.svg";
import hearthover from "../../SVGs/hearthover.svg";
import cart from "../../SVGs/cart.svg";
import carthover from "../../SVGs/carthover.svg";
import Logo from "../../SVGs/Logo.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Nav.css";

function Nav() {
  const navigate = useNavigate();
  const submitHandler = () => {
    navigate("/account");
  };
  const [hovercart, sethovercart] = useState(false);
  const handleMouseEnterCart = () => {
    sethovercart(true);
  };
  const handleMouseLeaveCart = () => {
    sethovercart(false);
  };

  const [hoverh, sethoverh] = useState(false);
  const handleMouseEnterHeart = () => {
    sethoverh(true);
  };
  const handleMouseLeaveHeart = () => {
    sethoverh(false);
  };

  const [hoverc, sethoverc] = useState(false);
  const handleMouseEnterContact = () => {
    sethoverc(true);
  };
  const handleMouseLeaveContact = () => {
    sethoverc(false);
  };
  return (
    <div>
      <nav className="navbar">
        <div className="rightcompnent">
          <ul>
            <img src={Logo} alt="Logo" />
            <a href="/home">
              <li>Home</li>
            </a>
            <a href="/shop">
              <li>Shop</li>
            </a>
            <a href="/login">
              <li>Products</li>
            </a>
            <a href="/login">
              <li>Pages</li>
            </a>
            <a href="/login">
              <li>Blog</li>
            </a>
            <a href="/login">
              <li>Buynow</li>
            </a>
          </ul>
        </div>
        <div className="icons">
          <img
            onMouseEnter={handleMouseEnterContact}
            onMouseLeave={handleMouseLeaveContact}
            onClick={submitHandler}
            src={hoverc ? contacthover : contact}
            alt="contact"
          />
          <img
            onMouseEnter={handleMouseEnterHeart}
            onMouseLeave={handleMouseLeaveHeart}
            src={hoverh ? hearthover : heart}
            alt="heart"
          />

          <img
            onMouseEnter={handleMouseEnterCart}
            onMouseLeave={handleMouseLeaveCart}
            src={hovercart ? carthover : cart}
            alt="cart"
          />
        </div>
      </nav>
    </div>
  );
}
export default Nav;
