import Nav from "../Home/Navbar/Nav";
import Main from "../Home/MainPage/MainPage";
import { useState } from "react";
function HomePage() {
  const [cartcount, setcartcount] = useState(0);
  const handleDataFromChild = () => {
    setcartcount(cartcount+1);
  };
  return (
    <div>
      <Nav />
      <Main receivedcartcount={cartcount} />
    </div>
  );
}
export default HomePage;
