import "./MainPage.css";
import arrow from "../../SVGs/arrow.svg";
import arrownothovered from "../../SVGs/arrownothovered.svg";
import collection from "../../SVGs/pexels-jatin-anand-125779.jpg";
import product1 from "../../SVGs/p-d3.webp";
import product2 from "../../SVGs/p-d9-3.webp";
import product3 from "../../SVGs/hmgoepprod_90104284-e151-482d-8d2e-1ce07f68e2f5.webp";
import { useState } from "react";
import Product from "../../Components/Product";
import product4 from "../../SVGs/hmgoepprod3.webp";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";

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
          img={product1}
          title={"Ribbed modal T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          img={product2}
          title={"Oversized Motif T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          img={product3}
          title={"Oversized Printed T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          onAddCartClick={props.onAddCartClick}
          className="Productt"
          img={product4}
          title={"Oversized Smiling T-shirt"}
          price={"$" + 18.0}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
