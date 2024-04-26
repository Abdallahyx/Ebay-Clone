import "./Footer.css";

function Footer() {
  return (
    <>
      <div className="Footer">
        <div className="Left">
          <p className="textt">Sign Up for Email</p>
          <p>
            Sign up to get first dibs on new arrivals, sales, exclusive content,
            events and more!
          </p>
          <div className="emailcomp">
            <input type="email" placeholder="Enter your email address"></input>
            <button>Subscribe</button>
          </div>
        </div>
        <div className="Right">
          <div className="footercolumn">
            <p className="text">Help</p>
            <p>Privacy Policy</p>
            <p>Returns + Exchanges</p>
            <p>Shipping</p>
            <p>Terms & Conditions</p>
            <p>FAQ’s</p>
            <p>Compare</p>
            <p>My Wishlist</p>
          </div>
          <div className="footercolumn">
            <p className="text">About</p>
            <p>Our Story</p>
            <p>Visit Our Store</p>
            <p>Contact Us</p>
            <p>Account</p>
            <p>FAQ’s</p>
          </div>
          <div className="footercolumn">
            <p className="text">Find us</p>
            <p>Find a location nearest you.</p>
            <a href="#">
              {" "}
              <p> See Our Stores </p>
            </a>
            <p>(08) 8942 1299</p>
          </div>
        </div>
      </div>
      <div className="ReservedRights">
        <p>© 2024 Ecomus Store . All Rights Reserved.</p>
      </div>
    </>
  );
}
export default Footer;
