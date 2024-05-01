import Nav from "../Home/Navbar/Nav";
import Productlist from "../Components/Productlist";
import "../Components/SearchBar.css";
import "../Components/Productlist.css";
import "../Components/ShopPage.css";
import { useState, useEffect } from "react";

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        

        const response = await fetch(`http://127.0.0.1:8000/products/?title=${searchTerm}&price_gt=${priceFilter.min}&price_lt=${priceFilter.max}&store_name=&category_name=${categoryFilter}&discount=unknown`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.results);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchData();
  }, [searchTerm,priceFilter, categoryFilter]);

  const handleSearch = (event) => {
    
    setSearchTerm(event.target.value);
  };

  const handlePriceFilter = (event) => {
    const { name, value } = event.target;
    setPriceFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
    console.log(priceFilter)
  };

  const handleCategoryFilter = (event) => {
    
    setCategoryFilter(event.target.value);
    console.log(categoryFilter)
  };




  return (
    <div>
      <Nav />
      <div className="shopPageContainer">
        <div className="filters">
          <div className="searchbar">
            <input
              type="text"
              placeholder="Search for products"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="priceFilter">
            <input
              type="number"
              placeholder="Min Price"
              name="min"
              value={priceFilter.min}
              onChange={handlePriceFilter}
            />
            <input
              type="number"
              placeholder="Max Price"
              name="max"
              value={priceFilter.max}
              onChange={handlePriceFilter}
            />
          </div>
          <div className="categoryFilter">
            <select value={categoryFilter} onChange={handleCategoryFilter}>
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothes">Clothes</option>
              <option value="sunglasses">Sunglasses</option>
              <option value="watches">Watches</option>
            </select>
          </div>
        </div>
        <Productlist products={products} />
      </div>
    </div>
  );
}

export default ShopPage;
