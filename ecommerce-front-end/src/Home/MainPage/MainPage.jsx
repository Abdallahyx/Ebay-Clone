import "./MainPage.css";
import arrow from "../../SVGs/arrow.svg";
import arrownothovered from "../../SVGs/arrownothovered.svg";
import collection from "../../SVGs/pexels-jatin-anand-125779.jpg";

import { useState } from "react";
import Product from "../../Components/Product";

import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";

// Default values shown  


function MainPage(props) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const shopCollection = () => {
    navigate("/shop");
  }

  return (
    <div>
      <div className="containerr">
        <div className="itemm onee">
          <div className="bigtitle">
            <p className="largee">Limited Edition</p>
    
            <p className="largee">Collection</p>
            <p className="textt">
              Shop exclusive pieces from our limited edition collection
            </p>
          </div>

          <div className="shop">
            <button
              onClick={shopCollection}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              Shop collection{" "}
              <img src={hovered ? arrow : arrownothovered} alt="arrow" />
            </button>
          </div>
        </div>
        <div className="itemm twoo">
          {" "}
          <img src={collection} alt="watch"></img>
        </div>
      </div>
      <div className="scrolling-text-container">
        <div className="scrolling-text">
          LIMITED TIME OFFER: FASHION SALE YOU CAN'T RESIST &nbsp;&nbsp;
          &nbsp;&nbsp; |&nbsp;&nbsp; &nbsp;&nbsp; FREE SHIPPING AND RETURNS
          &nbsp;&nbsp; &nbsp;&nbsp;|&nbsp;&nbsp; &nbsp;&nbsp; NEW SEASON, NEW
          STYLES: FASHION SALE YOU CAN'T MISS
        </div>
      </div>
      <div className="Products">
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          photo="Apple-IPhone-14-With-FaceTime-128GB-6GB-RAM_1407_2.jpeg"
          title={"Ribbed modal T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          photo="AppleWatchUltra.jpg"
          title={"Oversized Motif T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          photo="Samsung-71a43be3abebbcfd157bc81500.jpg"
          title={"Oversized Printed T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          photo="71VPHir5nhL._AC_SL1500_.jpg"
          title={"Oversized Smiling T-shirt"}
          price={"$" + 18.0}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
