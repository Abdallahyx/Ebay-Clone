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

function MainPage() {
  const [hovered, setHovered] = useState(false);

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
          className="Productt"
          image={product1}
          name={"Ribbed modal T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          className="Productt"
          image={product2}
          name={"Oversized Motif T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          className="Productt"
          image={product3}
          name={"Oversized Printed T-shirt"}
          price={"$" + 18.0}
        />
        <Product
          className="Productt"
          image={product4}
          name={"Oversized Smiling T-shirt"}
          price={"$" + 18.0}
        />
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;
