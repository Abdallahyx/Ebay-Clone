import "./MainPage.css";
import arrow from "../../SVGs/arrow.svg";
import arrownothovered from "../../SVGs/arrownothovered.svg";
import collection from "../../SVGs/pexels-jatin-anand-125779.jpg";
import { useState } from "react";

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
          LIMITED TIME OFFER: FASHION SALE YOU CAN'T RESIST
          &nbsp;&nbsp; &nbsp;&nbsp; |&nbsp;&nbsp; &nbsp;&nbsp; FREE SHIPPING AND RETURNS
          &nbsp;&nbsp; &nbsp;&nbsp;|&nbsp;&nbsp; &nbsp;&nbsp; NEW SEASON, NEW STYLES: FASHION SALE YOU CAN'T MISS
        </div>
      </div>
      <p>dasdasd</p>
    </div>
  );
}

export default MainPage;
