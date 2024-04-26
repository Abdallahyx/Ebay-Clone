import Nav from "../Home/Navbar/Nav";
import Productlist from "../Components/Productlist";
import SearchBar from "../Components/SearchBar";
import "../Components/Productlist.css";
import productimg from "../SVGs/hmgoepprod3.webp";
import "../Components/ShopPage.css";
import trial from"../SVGs/pexels-jatin-anand-125779.jpg"

function ShopPage() {

  const products = [
    {
      name: "Product1",
      price: 20,
      image: trial,
      className: "shopPageProduct"
    },
    {
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },
    {
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    },{
      name: "Product1",
      price: 20,
      image: productimg,
      className: "shopPageProduct"
    }
  ]

  
    
  
  return (
    <div>
        <Nav />
        <div className="shopPageContainer">
        <SearchBar />
        <Productlist products={products} />
        </div>
      
      
    </div>
  );
}
export default ShopPage;