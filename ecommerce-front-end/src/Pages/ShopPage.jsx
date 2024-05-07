import Nav from "../Home/Navbar/Nav";
import Productlist from "../Components/Productlist";
import "../Components/SearchBar.css";
import "../Components/Productlist.css";
import "../Components/ShopPage.css";
import { useState, useEffect } from "react";


function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // [electronics, clothes, sunglasses, watches
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: "", max: "" });
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try{
      const responsecategories= await fetch("http://127.0.0.1:8000/products/categories/",
        {
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          
          }
        }
      )
      if(!responsecategories.ok){
        throw new Error("Failed to fetch categories");
      }
      else{
        const datacategories = await responsecategories.json();
        console.log("datacategories")
        console.log(datacategories)
        setCategories(datacategories.results);
      }
    }
    catch(error){
      console.error("Error fetching categories:", error);
    }
     
      
      let currentpage = 1;
      let allResults = [];
      
        
      try {
        
        while(true)
          {
        const response = await fetch(`http://127.0.0.1:8000/products/?title=${searchTerm}&price_gt=${JSON.stringify(parseInt(priceFilter.min-0.1))}&price_lt=${priceFilter.max}&store_name=&category_name=${categoryFilter}&discount=unknown&page=${currentpage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response)
        if (!response.ok) {
          throw new Error("Failed to fetch products");
          break;
        }
        const data = await response.json();
        allResults = allResults.concat(data.results);
        currentpage++;
      }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setProducts(allResults);

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
  };

  const handleCategoryFilter = (event) => {
    
    setCategoryFilter(event.target.value);
  
  };

  const categoryOptions = ()=>{
  
    return (categories.map((categories)=>{
    return <option value={categories.name}>{categories.slug}</option>
  }
  ))
}


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
              {
                categoryOptions()
              }
              
            </select>
          </div>
        </div>
        <Productlist products={products} />
      </div>
    </div>
  );
}

export default ShopPage;
