import Nav from "../Home/Navbar/Nav";
import Main from "../Home/MainPage/MainPage";
import { useState } from "react";
function HomePage() {
  
  const [count,setCount]=useState(0);
  const onAddCartClick=(clicked)=>
  {
    if(clicked)
    {
      setCount(count+1);
    }
    clicked=false;
      
  }
  return (
    <div>
      <Nav count={count}/>
      <Main onAddCartClick={onAddCartClick} />
    </div>
  );
}
export default HomePage;
