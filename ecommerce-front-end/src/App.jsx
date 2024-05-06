import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Login from "./Login/Login";
import RegisterPage from "./Pages/RegisterPage";
import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import SellerProfilePage from "./Pages/SellerProfilePage";
import ShopPage from "./Pages/ShopPage";
import RegisterationType from "./Pages/RegisterationType";
import SellerRegisteration from "./Pages/SellerRegisteration";
import OrderHistory from "./Pages/OrderHistory";
import InventoryPage from "./Pages/InventoryPage";
import ProductPage from "./Pages/ProductPage";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import SuccessPage from "./Pages/SuccessPage";
import TransactionHistory from "./Pages/TransactionHistory";
import TransactionHistorySeller from "./Pages/TransactionHistorySeller";
import PaymentHistory from "./Pages/PaymentHistory";
import Loader from "./Components/Loader"; // Import your Loader component
import NavigationListener from "./Components/NavigationListener";
import { useState, useEffect } from "react";
const token = localStorage.getItem("token");
function App() {

  const [loading, setLoading] = useState(false); // State to track loading status
  const [checkoutprice, setCheckoutPrice] = useState();


  const passPrice = (price) => {
    setCheckoutPrice(price);
  }
  console.log(loading);
  return (
    <BrowserRouter>  {/* Wrap everything here */}
      <NavigationListener setLoading={setLoading} /> {/* Pass the setLoading function to the NavigationListener component */}
      {loading && <Loader/>} {/* Render the Loader component when loading is true */}
      {!loading && 
      <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registerationtype" element={<RegisterationType/>}/>
      <Route path="/signupbuyer" element={<RegisterPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/signupseller" element={<SellerRegisteration />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="" element={<Login />} />
      <Route path="/account" element={<ProfilePage />} />{" "}
      <Route path="/selleraccount" element={<SellerProfilePage />} />{" "}
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/orderhistory" element={<OrderHistory/>}/> {/*should be orderhistory+accountid*/}
      <Route path="/inventory" element={<InventoryPage/>}/> {/*should be orderhistory+accountid*/}
      <Route path="/product/:slug" element={<ProductPage />} /> {/*Route for product page*/}
      <Route path="/cart" element={<CartPage passPrice={passPrice} />} />
      <Route path="/checkout" element={<CheckoutPage checkoutprice={checkoutprice}/>} />
      <Route path="/verify" element={<SuccessPage />} />
      <Route path="/transactionhistorycustomer" element={<TransactionHistory />} />
      <Route path="/transactionhistoryseller" element={<TransactionHistorySeller />} />
      <Route path="/paymenthistory" element={<PaymentHistory />} />
      <Route path="/success/*" element={<SuccessPage token={token}/>} />
    </Routes>}
      
    </BrowserRouter>
  );
}

export default App;
